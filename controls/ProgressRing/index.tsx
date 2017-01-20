import * as React from "react";

import { ThemeType } from "../../style/ThemeType";
import vendors from "../../common/browser/vendors";
const vendorStrs: string[] = vendors.map(str => str ? `-${str}-` : str);

const defaultProps: ProgressRingProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	itemLength?: number;
	itmeStyle?: React.CSSProperties;
	size?: number;
	itemSize?: number;
	delay?: number;
}
interface ProgressRingProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
interface ProgressRingState {}

const getInnerCSS = (instance: ProgressRing) => (
`.react-uwp-progress-ring {
}
${Array(instance.props.itemLength).fill(0).map((name, index) => (
	[".react-uwp-progress-ring-item-" + index + " {",
	vendorStrs.map(str => (`		${str}animation: CircleLoopFade 2500ms ${index * .125}s linear infinite normal forwards;`)).join("\n"),
	"	}"].join("")
)).join("")}

${vendorStrs.map(str => `@${str}keyframes CircleLoopFade {
	0% {
		transform: rotateZ(0deg);
		opacity: 0.5;
	}
	25% {
		transform: rotateZ(180deg);
		opacity: 1;
	}
	50% {
		transform: rotateZ(270deg);
		opacity: .8;
	}
	75% {
		transform: rotateZ(300deg);
		opacity: .125;
	}
	100% {
		transform: rotateZ(360deg);
		opacity: 0;
	}
}`)}.join("")`);

export default class ProgressRing extends React.Component<ProgressRingProps, ProgressRingState> {
	static defaultProps: ProgressRingProps = {
		...defaultProps,
		className: "",
		itemLength: 6,
		size: 200,
		itemSize: 26,
		delay: 100,
	};
	state: ProgressRingState = {};
	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };
	itemElms: HTMLDivElement[] = [];

	render() {
		const {
			itemLength, itmeStyle, size,
			// tslint:disable-next-line:no-unused-variable
			itemSize, delay,
			style, ...attributes
		} = this.props;
		const { theme } = this.context;

		return (
			<div
				{...attributes}
				className="react-uwp-progress-ring"
				style={{
					...style,
					width: size,
					height: size,
					position: "relative"
				}}
			>
				<style type="text/css"  dangerouslySetInnerHTML={{ __html: getInnerCSS(this) }} />
				<div>
					{Array(itemLength).fill(0).map((numb, index) => (
						<div
							key={`${index}`}
							className={`react-uwp-progress-ring-item-${index}`}
							ref={(item) => this.itemElms.push(item)}
							style={theme.prepareStyles({
								background: "#fff",
								...itmeStyle,
								position: "absolute",
								top: 0,
								left: size / 2,
								width: itemSize,
								height: itemSize,
								opacity: 0,
								transformOrigin: `0px ${size / 2}px`,
								borderRadius: itemSize,
							})}
						/>
					))}
				</div>
			</div>
		);
	}
}
