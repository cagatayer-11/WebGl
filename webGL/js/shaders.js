const vsSource = `#version 300 es
    uniform float angle;
    in vec4 a_position;
    in vec4 a_color;
    out vec4 color;
    uniform vec2 scalingFactor;
    uniform float spiralAngle;
    uniform float distance;

        
    
    void main() {
      float s = sin( angle );
      float c = cos( angle );
      float x = (-s * a_position.y + c * a_position.x) * scalingFactor.x;
      float y = (s * a_position.x + c * a_position.y) * scalingFactor.y;

       
      gl_Position.x = x + distance * cos(spiralAngle)  ;
      gl_Position.y = y + distance * sin(spiralAngle)  ;
      gl_Position.z = 0.0;
      gl_Position.w = 1.0;
    
      color = a_color;
        
      }
  `;

const fsSource = `#version 300 es
    precision mediump float;
    in vec4 color;
    out vec4 outColor;
    

    void main() {
        outColor = color;
    }
  `