import React,{Component} from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import './App.css';

const app = new Clarifai.App({
  apiKey:'3dcd62482092441d9a7de648efdb466d'
});

const parameteroptions={

                particles: {
                  number: {
                    value: 70,
                    density: {
                      enable: true,
                      value_area: 800

                    }
                  }
                }
              }
  
  const initialState={
     input: '',
      imageurl: '',
      box: {},
      route: 'SignIn',
      isSignedIn: false,
      user:{
        id: '',
    name : '',
    email: '',
    entries:0,
    joined: ''

      }

  }
class App extends Component {
  constructor(){
    super();
    this.state =  initialState;  
}
loaduser =(data) => {
  this.setState({user: {
    id: data.id,
    name : data.name,
    email: data.email,
    entries:data.entries,
    joined: data.joined

  }})
}

calculateFaceLoc =(data) => {
  const clarifaiface=data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputimage');
  const width =Number(image.width);
 const height =Number(image.height);  

return {
leftCol:clarifaiface.left_col * width,
topRow: clarifaiface.top_row * height,
rightCol:width - (clarifaiface.right_col * width),
bottomRow: height -(clarifaiface.bottom_row * height)


}

}

displayFaceBox = (box) => {
  this.setState({box:box});
}
  onInputChange = (event) => {
    this.setState({input:event.target.value});
  }
  onButtonSubmit =() => {
    this.setState({imageurl: this.state.input});


    app.models.predict(Clarifai.FACE_DETECT_MODEL,this.state.input)
    .then(response => {
      if(response){
        fetch('https://lit-basin-19759.herokuapp.com/image',{
          method:'put',
      headers: {'Content-Type': 'application/json'},
      body:JSON.stringify({
        id:this.state.user.id
     })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user,{entries:count}))
        
        })
        .catch(console.log);
      }


    this.displayFaceBox(this.calculateFaceLoc(response))})  // do something with response
    .catch(err => console.log(err));
      // there was an error    
  } 
  onRouteChange = (route) =>{
   if( route==='signout') {
    this.setState(initialState)
   }
   else{
    this.setState({isSignedIn:true})
   }
    this.setState({route:route});
  }


  render(){
      return (
    <div className="App">

    <Particles className='particles'
              params={parameteroptions}
            />
     <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}  />
     { this.state.route ==='home'
    ? <div>
    <Logo />
   <Rank name={this.state.user.name} entries={this.state.user.entries}/> 
     <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
   <FaceRecognition box ={this.state.box} imageurl={this.state.imageurl} />
   </div>
   : (
       this.state.route==='SignIn'
       ?  <SignIn loaduser={this.loaduser} onRouteChange={this.onRouteChange} /> 
       :<Register loaduser={this.loaduser} onRouteChange={this.onRouteChange}/>

    )
  }

    </div>
  );
}
  }


export default App;
