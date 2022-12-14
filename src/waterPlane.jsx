//Water displacement adapted from Richard Thompson @ https://codesandbox.io/s/zen-matan-np1ijb?from-embed=&file=/src/plane.jsx:687-710
import React, { useRef, useEffect, useCallback, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

let position = Array(100)
    .fill(1)
    .map((item) => ({
        origin: new THREE.Vector3(0, 0, 0),
        radius: 10
    }));
let formattedPosition = position.map(({ origin }) => origin);
let radi = position.map(({ radius }) => radius);

const customShader = {
    uniforms: {
        time: {
            value: 0
        },
        positions: {
            value: formattedPosition
        },
        len: {
            value: 1
        },
        radi: {
            value: radi
        },
        resolution: {
            value: new THREE.Vector2()
        }
    },
    vertexShader: {
        top: `
            #define STANDARD
            uniform float time;
            uniform vec3 positions[100];
            uniform int radi[100];
            uniform vec2 resolution;
            mat4 rotationMatrix(vec3 axis, float angle) {
                axis = normalize(axis);
                float s = sin(angle);
                float c = cos(angle);
                float oc = 1.0 - c;
                return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                            oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                            oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                            0.0,                                0.0,                                0.0,                                1.0);
            }
            vec3 rotate(vec3 v, vec3 axis, float angle) {
                mat4 m = rotationMatrix(axis, angle);
                return (m * vec4(v, 1.0)).xyz;
            }
            float Remap (float value, float from1, float to1, float from2, float to2) {
                return (value - from1) / (to1 - from1) * (to2 - from2) + from2;
            }
        `,

        bottom: `
            float loop = 28.0;
            float sum = 0.0;
            float velocity = 10.0;
            float raio = 1.0;
            float total = 200.0;

            // We loop over the mouse intersections creating the 
            // cumulative displacement to make look more natural.

            for (int i = 0; i< 100;i++) {

            // Due to glsl not really allowing dynamic arrays
            // we pass a fixed length array with starting intersections
            // of 100 vec3(0.0, 0.0, 0.0).

            if (positions[i].x != 0.0) {

                // Calculate the diameter of the ripple using the decreasing radius 
                // Mapping to 0.0 - 0.8. This means the larger the radius the smaller 
                // the ripple, which is inline with a real water ripple.. ripples get larger.

                float diameter = 1.0 + Remap(float(radi[i]),total, 0.0, 0.0, 0.2);

                // The larger the index i gets the larger the value
                // which means the larger the diameter. So the older the 
                // mouse intersection with the plane the larger the diameter 
                // will be.

                float newRange = Remap(float(i), 0.0,100.0, 0.0, .80);

                // Comparison is what controls the diameter of the ripple, which increases
                // over time.

                float widthOfRipple = pow((diameter + newRange ), 2.0);
                
                // This is used to decrease the ripple back to zero
                float decreaseRipple = 1.0 + Remap(float(radi[i]),total, 0.0, .80, -.70);
                
                // Wave strength 
                float wave = 1.0;
                
                // Array of mouse positions (100) that intersect the plane
                vec3 mouse = positions[i].xyz;
                
                // Caculate the distance for each intersection from the current
                // vertex position to the mouse intersection. Allowing us to create a sin
                // wave from a specific point.

                float distanceFromCurrentVertex =distance(position, mouse);

                // What size is the ripple? Is the distance to the ripple
                // within the bounds of the width of the ripple, if so we
                // calculate the displacement of the y coordinate. 
                if (distanceFromCurrentVertex < widthOfRipple) {

                    // Calculate the actual ripple or displacement 
                    float ripple = cos(sin(distanceFromCurrentVertex * wave - time * velocity));

                    // we want to decrease the strength of the wave over time and therefore
                    // the ripple strength 
                    wave -= decreaseRipple;

                    // Sum the ripples, all 100 of them. And decrease over time
                    // to diseminate the ripple 
                    sum += ripple * decreaseRipple;

                    // When we get to 0 by decreasing the sum of ripples and
                    // the strength of a ripple, we set to 0. So we add nothing
                    // to the original position
                    if (sum < 0.0) {
                    sum =0.0;
                    }
                    if (wave < 0.0) {
                    wave = 0.0;
                    }
                }
            }
            }

            // Add the overall displacement sum (tuning with a division)
            // to the Y of the current vertex position
            float z = position.z + sum/200.0;

            // And finally the usual matrix multiplications
            vec4 modelView = modelViewMatrix * vec4( position.x, position.y, z, 1.0);
            gl_Position = projectionMatrix *modelView;
        `
    }
};

// START OF COMPONENT
export const WaterPlane = () => {
    const increment = 1.0;
    const ref = useRef();

    useEffect(() => {
        setInterval(calc, 10);
    }, []);

    const OBC = useCallback((shader) => {
        console.log({ shader });
        // setShaderRef(shader);
        shader.uniforms = { ...shader.uniforms, ...customShader.uniforms };

        shader.vertexShader = shader.vertexShader.replace(
            "#define STANDARD",
            customShader.vertexShader.top
        );
        shader.vertexShader = shader.vertexShader.replace(
            `#include <fog_vertex>`,
            customShader.vertexShader.bottom
        );
    }, []);

    function calc() {
        const updated = position.map(({ origin, radius }, index) => {
            if (radius === 10) {
                return { origin, radius: 0 };
            }
            return { origin, radius: radius - increment };
        });

        position = updated.slice(0, 100);
        formattedPosition = position.map(({ origin }) => origin);
        radi = position.map(({ radius }, index) => radius);
    }

    const material = useMemo(() => {
        const m = new THREE.MeshPhysicalMaterial({
            color: "white",
            opacity: 0,
            transmission: 0.8,
            thickness: 0.1,
            roughness: 0.1
        });

        m.onBeforeCompile = OBC; // Modifies the shader
        return m;
    }, [OBC]);

    useFrame(({ clock }) => {
        customShader.uniforms.time.value = clock.timeElapsed;
        customShader.uniforms.positions.value = formattedPosition;
        customShader.uniforms.radi.value = radi;
    });

    return (
        <mesh
            position={[0.1, -0.8, 0]}
            rotation={[Math.PI / -2, 0, 0]}
            material={material}
            onPointerMove={(e) => {
                if (position.length === 100) {
                    position.unshift({
                        origin: e.intersections[0].point,
                        radius: 50.0
                    });
                }
            }}
        >
            <planeGeometry args={[6, 3, 100, 50]} />

        </mesh>
    );
};
