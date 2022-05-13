import React from 'react';

import { Plugins } from '@clappr/plugins';
import Clappr from '@clappr/core';
import Grid from '@mui/material/Grid';
import HLS from '@clappr/hlsjs-playback';
//import ClapprStats from '@clappr/stats-plugin';

/*
import Clappr from 'clappr';
import ClapprStats from 'clappr-stats';
*/

//import ClapprNerdStats from 'clappr-nerd-stats';

Clappr.Loader.registerPlayback(HLS);

for (let plugin of Object.values(Plugins)) {
	Clappr.Loader.registerPlugin(plugin);
}

class Player extends React.Component {
	constructor(props) {
		super(props);

		this.player = new Clappr.Player({});

		this.playerRef = React.createRef();
	}

	componentDidMount() {
		this.player.attachTo(this.playerRef.current);
		this.setConfig(this.props.config);
		this.setSource(this.props.source);
	}

	componentWillUnmount() {
		this.player.destroy();
	}

	shouldComponentUpdate(nextProps, _) {
		if (nextProps.source !== this.props.source) {
			this.setSource(nextProps.source);
		}

		return false;
	}

	setSource(source) {
		this.player.load(source);
	}

	setConfig(config) {
		delete config.source;
		delete config.sources;
		delete config.parent;
		delete config.parentid;

		config = {
			plugins: [],
			...config,
		};

		const plugins = config.plugins;
		config.plugins = [];

		for (let p of plugins) {
			switch (p) {
				/*
    			case 'ClapprStats':
    				config.plugins.push(ClapprStats);
    				break;
*/
				/*
    			case 'ClapprNerdStats':
    				config.plugins.push(ClapprNerdStats);
    				break;
*/
				default:
					break;
			}
		}
		this.player.configure(config);
	}

	render() {
		return (
			<Grid
				container
				direction="column"
				justifyContent="center"
				alignItems="center"
				spacing={1}
				style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}
				ref={this.playerRef}
			></Grid>
		);
	}
}

export default Player;
