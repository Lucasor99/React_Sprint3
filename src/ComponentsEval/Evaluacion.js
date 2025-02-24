import Card2 from '../ComponentsResumen/Card2';
import React from 'react';
import axios from 'axios';


var a = JSON.parse(localStorage.getItem("user"));

export default class Evaluaciones extends React.Component {

  constructor(props){
    super(props);

		this.state = {
			datos: [[]],
      
		};

    this.downloadpdf = this.downloadpdf.bind(this);
    this.aceptar = this.aceptar.bind(this);
   
  }


  async componentDidMount() {

		let response = await fetch("http://localhost:8080/resumenes");

		let resumenes = await response.json();

    this.setState({datos: resumenes});

    console.log(resumenes[0])
    
    console.log(resumenes[0].titulo)

    console.log(this.state.datos[0].titulo)
    
	}

  render() {

    return(

    <div id="resum1" className="resum"> 

    <h1 id ="h1_eval">¡Hola {a.nombre}, tienes los siguientes resúmenes a evaluar!</h1>
      <div className='resumenesflex'>
      {this.state.datos.map((resumen)=>{
        if(resumen.publicado === false){
          return <Card2 key={resumen.id}
          leer ={()=> this.downloadpdf(resumen)}
          aceptar = {()=> this.aceptar(resumen.id)}
          rechazar = {()=> this.rechazar(resumen.id)}
          foto1={"data:image/png;base64,"+ resumen.imagen}
          title={resumen.titulo}
          descripcion={resumen.descripcion}
          autor={resumen.autor}/>
        }

      })}
      </div>
    </div>
    );
  }

  downloadpdf(resumen) {
    axios({
      url: 'http://localhost:8080/resumenes/'+resumen.id+'/pdf',
      method: 'GET',
      responseType: 'blob'
    }).then((response) => {
      console.log(response);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', resumen.titulo+'.pdf')
      document.body.appendChild(link)
      link.click()
    })
   }

   async aceptar(identificador){

    await axios.put("http://localhost:8080/resumenes/"+identificador)
    window.location.reload(true);
   }

   async rechazar(identificador){

    await axios.delete("http://localhost:8080/resumenes/"+identificador)
    window.location.reload(true);
   }

}

