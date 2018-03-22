uniform float uv_fade;
uniform float uv_alpha;
uniform vec3 simColor;
uniform float simMarker;

in vec2 texcoord;
in float galpha;

out vec4 fragColor;

void main(void)
{
	
	float rad = length(texcoord);
	
	if (simMarker == 1) {
		//make a triangle
		if (abs(texcoord.x) > 0.5*(1. + texcoord.y) ){
			discard;
		}
	} else {
		//make a circle
		if (rad > 1.){
			discard;
		}
	}

	vec4 color = vec4(simColor, 1.);
	color *= galpha;
	color.a *=  uv_fade * uv_alpha;

	fragColor = color;
		
}
