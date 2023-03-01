export default interface Switch {
	readonly name: string;
	readonly number: number;
	readonly open: boolean;
	readonly addHitHandler: (args: { onHit: () => void }) => () => void;
}