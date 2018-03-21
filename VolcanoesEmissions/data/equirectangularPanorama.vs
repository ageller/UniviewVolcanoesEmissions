in vec3 uv_vertexAttrib;
in vec2 uv_texCoordAttrib0;
uniform vec4 uv_cameraPos;
uniform mat4 uv_modelViewInverseMatrix;
uniform mat4 uv_modelViewProjectionMatrix;
uniform mat4 uv_scene2ObjectMatrix;
uniform float Scale;
uniform vec3 RotationAxis;
uniform float RotationAngle;

const float PI = 3.1415926535897932384626433;
const float DEG2PI = PI / 180.0;

flat out float DistanceFade;
out vec2 TexCoord;

mat4 getRotationMatrix(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

void main()
{  
  //Calculate the distance between the camera and the center of the panorama to fade out the panorama
  //float cameraDistance = length((uv_modelViewInverseMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz) / Scale; 
  //DistanceFade = smoothstep(1, 0, cameraDistance);  
  vec3 center =   (uv_scene2ObjectMatrix * uv_cameraPos).xyz;
  //Rotate the sphere the specified angle about the specified axis
  gl_Position = uv_modelViewProjectionMatrix *(Scale *(getRotationMatrix(RotationAxis, RotationAngle)*vec4(uv_vertexAttrib,0.0))+vec4(center, 1.0));    		  
  
  //Pass through the texture coordinates
  TexCoord = uv_texCoordAttrib0;  
}