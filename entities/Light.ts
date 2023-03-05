import { LightInfo } from '../const/Lights/Lights';

export default interface Light extends LightInfo {
	readonly name: string;
	readonly id: number;
}
