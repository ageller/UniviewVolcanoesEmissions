layout(triangles) in;
layout(triangle_strip, max_vertices = 4) out;

uniform float Scale;

uniform mat4 uv_modelViewProjectionMatrix;
uniform mat4 uv_modelViewInverseMatrix;
uniform vec4 uv_cameraPos;
uniform mat4 uv_scene2ObjectMatrix;

uniform int uv_simulationtimeDays;
uniform float uv_simulationtimeSeconds;
uniform float uv_fade;

uniform float simBindRealtime;
uniform float simUseTime;
uniform float simRealtimestart;
uniform float simRealtimeend;
uniform float simdtmin;

out vec2 texcoord;


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

void toEquiRectangular(vec4 pos)
{
	vec3 RotationAxis = vec3(1., 0., 0.);
	float RotationAngle = 0.;
	vec3 center =   (uv_scene2ObjectMatrix * uv_cameraPos).xyz;
	
	gl_Position = uv_modelViewProjectionMatrix *(Scale *(getRotationMatrix(RotationAxis, RotationAngle)*vec4(pos.xyz,0.0))+vec4(center, 1.0));    		  

}


void drawSprite(vec3 pos, float radius, float rotation)
{
	vec4 position = vec4(pos, 1.);
	
    vec3 objectSpaceUp = vec3(0, 0, 1);
    vec3 objectSpaceCamera = (uv_modelViewInverseMatrix * vec4(0, 0, 0, 1)).xyz;
    vec3 cameraDirection = normalize(objectSpaceCamera - position.xyz);
    vec3 orthogonalUp = normalize(objectSpaceUp - cameraDirection * dot(cameraDirection, objectSpaceUp));
    vec3 rotatedUp = (getRotationMatrix(cameraDirection, rotation) * vec4(orthogonalUp, 1.)).xyz;
    vec3 side = cross(rotatedUp, cameraDirection);
	
    texcoord = vec2(-1., 1.);
	toEquiRectangular(uv_modelViewProjectionMatrix * vec4(position.xyz + radius * (-side + rotatedUp), 1));
	EmitVertex();
	
    texcoord = vec2(-1., -1.);
	toEquiRectangular(uv_modelViewProjectionMatrix * vec4(position.xyz + radius * (-side - rotatedUp), 1));
	EmitVertex();
	
    texcoord = vec2(1, 1);
	toEquiRectangular(uv_modelViewProjectionMatrix * vec4(position.xyz + radius * (side + rotatedUp), 1));
	EmitVertex();
	
    texcoord = vec2(1, -1.);
	toEquiRectangular(uv_modelViewProjectionMatrix * vec4(position.xyz + radius * (side - rotatedUp), 1));
	EmitVertex();
	
	EndPrimitive();
}


void main()
{


	
//////////////////////////////////////////////////////////////
//define the time 
	//each Uniview year represents one Myr
	float dayfract = uv_simulationtimeSeconds/(24.0*3600.0);//0.5*2.0*3.14*(time)/(sqrt(a.x*a.x*a.x/3347937656.835192));
	//float yrs = 365. + 6./24. +  9./1440. +  9./86400. ; //sidereal year
	//float yrs = 365. + 5./24. + 48./1440. + 46./86400. ; //solar year
	float yrs = 365.2425;
	float years_0 = 1970. + (uv_simulationtimeDays + dayfract)/yrs;
	float univYr = clamp(years_0,0.0,13800.0); 
		
		
	float timeend = simRealtimeend;
	float timestart = simRealtimestart;
	float simTime = gl_in[0].gl_Position.x;
	float usedt = max(gl_in[1].gl_Position.z, simdtmin);
	float cosmoTime = simUseTime;     

	if (simBindRealtime == 1.){
		cosmoTime = univYr;
	} 


//////////////////////////////////////////////////////////////

    if ((cosmoTime >= simTime && cosmoTime < (simTime + usedt)) || (simTime >= timeend && cosmoTime >= timeend) || (simTime <= timestart && cosmoTime <= timestart)) {


		drawSprite(vec3(0.), 1., 0.);
	}

}
