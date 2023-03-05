import { CoilInfo } from '@/const/Coils/Coils';

export default interface Coil extends CoilInfo {
	readonly name: string;
	readonly id: number;
}
