layout(triangles) in;
layout(triangle_strip, max_vertices = 4) out;

uniform mat4 uv_modelViewProjectionMatrix;
uniform mat4 uv_modelViewMatrix;
uniform mat4 uv_projectionMatrix;
uniform mat4 uv_projectionInverseMatrix;
uniform mat4 uv_modelViewInverseMatrix;
uniform vec4 uv_cameraPos;
uniform mat4 uv_scene2ObjectMatrix;

uniform int uv_simulationtimeDays;
uniform float uv_simulationtimeSeconds;
uniform float uv_fade;

uniform float simBindRealtime;
uniform float simUseTime;
uniform float simdtmin;
uniform float simSize;
uniform float simTfade;
uniform float simAlphaMin;

out vec2 texcoord;
out float galpha;

const float PI = 3.1415926535897932384626433;
const float DEG2RAD = PI / 180.0;

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


vec3 getPos(vec2 lonlat, vec2 s){
	
	vec2 p = lonlat + s;

	float r = 1.;

	float x = r * cos(p.x)*cos(p.y);
	float y = -1. * r * sin(p.x)*cos(p.y);
	float z = r * sin(p.y);

	return vec3(x,y,z);
}

void drawSprite(vec4 position, float radius, float rotation)
{
    vec3 objectSpaceUp = vec3(0, 0, 1);
    vec3 objectSpaceCamera = (uv_modelViewInverseMatrix * vec4(0, 0, 0, 1)).xyz;
    vec3 cameraDirection = normalize(objectSpaceCamera - position.xyz);
    vec3 orthogonalUp = normalize(objectSpaceUp - cameraDirection * dot(cameraDirection, objectSpaceUp));
    vec3 rotatedUp = mat3(getRotationMatrix(cameraDirection, rotation)) * orthogonalUp;
    vec3 side = cross(rotatedUp, cameraDirection);
    texcoord = vec2(-1., 1.);
	gl_Position = uv_modelViewProjectionMatrix * vec4(position.xyz + radius * (-side + rotatedUp), 1);
	EmitVertex();
    texcoord = vec2(-1., -1.);
	gl_Position = uv_modelViewProjectionMatrix * vec4(position.xyz + radius * (-side - rotatedUp), 1);
	EmitVertex();
    texcoord = vec2(1, 1);
	gl_Position = uv_modelViewProjectionMatrix * vec4(position.xyz + radius * (side + rotatedUp), 1);
	EmitVertex();
    texcoord = vec2(1, -1.);
	gl_Position = uv_modelViewProjectionMatrix * vec4(position.xyz + radius * (side - rotatedUp), 1);
	EmitVertex();
	EndPrimitive();
}



void main()
{


	
//////////////////////////////////////////////////////////////
//define the time 
	//each Uniview year represents one Myr
	float dayfract = uv_simulationtimeSeconds/(24.0*3600.0);
	float yrs = 365.2425;
	float years_0 = 1970. + (uv_simulationtimeDays + dayfract)/yrs;
	float univYr = clamp(years_0,0.0,13800.0); 
		

	float simTime = gl_in[1].gl_Position.x;
	float simTimeEnd = gl_in[1].gl_Position.y;
	float usedt = simTimeEnd - simTime;
	if (simTimeEnd < 0){
		usedt = simdtmin;
	}

	float cosmoTime = simUseTime;     
	if (simBindRealtime == 1.){
		cosmoTime = univYr;
	} 

	vec2 lonlat = vec2(gl_in[0].gl_Position.xy) * DEG2RAD;
	float s = gl_in[0].gl_Position.z;

	galpha = 1.;
	float sMult = 1.;
	vec3 position = vec3(0);
	vec3 center = (uv_scene2ObjectMatrix * uv_cameraPos).xyz;
	mat4 RotMat = getRotationMatrix(vec3(0., 0., 1.), -PI/2.);
	
//////////////////////////////////////////////////////////////

    if ( cosmoTime >= simTime  ) {

		galpha = 1. - clamp( (cosmoTime - simTime - usedt)/simTfade , 0., 1. - simAlphaMin);
		sMult = 1. - clamp( (cosmoTime - simTime - usedt)/simTfade , 0., 1.);
		position = getPos(lonlat, vec2(0. , 0.));
		drawSprite(RotMat*vec4(position, 0.0) + vec4(center, 0.0), simSize * (sMult * s + 1.), 0.0);
	}

}
