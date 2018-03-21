in vec2 texcoord;

out vec4 fragColor;

void main(void)
{
	
	float rad = length(texcoord);
	
	//make a circle
	if (rad > 1.){
		discard;
	}
	vec4 color = vec4(1., 0., 0., 1.);
	fragColor = color;
	
	
}
