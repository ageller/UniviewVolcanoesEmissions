uniform float uv_fade;
uniform float uv_alpha;

flat in float DistanceFade;
in vec2 TexCoord;

uniform sampler2D panorama;
uniform vec4 ColorMultiplier;

out vec4 FragColor;

void main()
{	
	//Read the color from the texture and apply the appropreate color and alpha multipliers
	vec4 color = texture2D(panorama,TexCoord);
	color *= ColorMultiplier;
	color.a *= uv_fade*uv_alpha;
	FragColor = color;
}