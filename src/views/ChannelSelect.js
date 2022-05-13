import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChannelSelector(props) {
	const navigate = useNavigate();

	React.useEffect(() => {
		onMount();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onMount = () => {
		const channelid = props.restreamer.GetCurrentChannelID();

		navigate(`/${channelid}`, { replace: true });
	};

	return null;
}
