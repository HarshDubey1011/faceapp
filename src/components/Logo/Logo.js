import React from 'react';
import Tilt from 'react-tilt';
import brain from './brain.png';
import './Logo.css';


const Logo= () => {
	return(
		<div className="mv2 mh5">
<Tilt className="Tilt br2 shadow-2" options={{ max : 100 }} style={{ height: 100, width: 100 }} >
 <div className="Tilt-inner pa3"> <img style= {{paddingtop: '5px'}} alt='logo' src={brain}/> </div>
</Tilt>
</div>
	);
}
export default Logo;
