import './App.css';
import { useState } from "react";
import Axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2'

function App() {

  const [nombre,setNombre] = useState("");
  const [apellido,setApellido] = useState("");
  const [correo,setCorreo] = useState("");
  const [id,setId] = useState();

  const [editar,setEditar] = useState(false);

  const [clientesList,setClientes] = useState([]);

  const add = ()=>{
    Axios.post("http://localhost:8080/create",{
      nombre:nombre,
      apellido:apellido,
      correo:correo
    }).then(()=>{
      getClientes();
      limpiar();
      Swal.fire({
        title: "<strong>Datos Guardados</strong>",
        html: "<i>El cliente <strong>"+nombre+"</strong> ha sido registrado</i>",
        icon: 'success'
      })
    });
  }

  const update = ()=>{
    Axios.put("http://localhost:8080/update",{
      id:id,
      nombre:nombre,
      apellido:apellido,
      correo:correo
    }).then(()=>{
      limpiar();
      Swal.fire({
        title: "<strong>Datos Actualizados</strong>",
        html: "<i>El cliente <strong>"+nombre+"</strong> ha sido actualizado</i>",
        icon: 'success'
      })
    });
  }

  const deleteClient = (val)=>{
    Swal.fire({
      title: "Eliminar",
      html: "<i>¿Desea eliminar al cliente <strong>"+val.nombre+"</strong>?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:8080/delete/ ${val.id}`).then(()=>{
          getClientes();  
          limpiar();
          Swal.fire({
            title: "Eliminado",
            text: "El cliente "+val.nombre+" ha sido eliminado",
            icon: "success",
            timer: 3000
          });
        });
      }
    });
  }

  const limpiar = ()=>{
    setNombre("");
    setApellido("");
    setCorreo("");
    setId("");
    setEditar(false);
  }

  const editarCliente = (val)=>{
    setEditar(true);
    setNombre(val.nombre)
    setApellido(val.apellido)
    setCorreo(val.correo)
    setId(val.id)
  }

  const getClientes = ()=>{
    Axios.get("http://localhost:8080/clientes").then((response)=>{
      setClientes(response.data);
    });
  }

  getClientes();

  return (
    <div className="container">

    <div className="card text-center">
      <div className="card-header">
        Clientes
      </div>
      <div className="card-body">
        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">Nombre:</span>
          <input type="text" 
          onChange={(event)=>{
            setNombre(event.target.value);
          }}
          className="form-control" value={nombre} placeholder="Ingrese un nombre" aria-label="Username" aria-describedby="basic-addon1"/>
        </div>

        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">Apellido:</span>
          <input type="text" value={apellido}
          onChange={(event)=>{
            setApellido(event.target.value);
          }}
          className="form-control" placeholder="Ingrese un apellido" aria-label="Username" aria-describedby="basic-addon1"/>
        </div>

        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">Correo:</span>
          <input type="text" value={correo}
          onChange={(event)=>{
            setCorreo(event.target.value);
          }}
          className="form-control" placeholder="Ingrese un correo" aria-label="Username" aria-describedby="basic-addon1"/>
        </div>

      </div>
      <div className="card-footer text-body-secondary">
        {
          editar? 
          <div>
           <button className='btn btn-warning m-2' onClick={update}>Actualizar</button>
           <button className='btn btn-info m-2' onClick={limpiar}>Cancelar</button>
          </div>
          :<button className='btn btn-success' onClick={add}>Guardar</button>
        }
      </div>
    </div>

    <table className="table table-striped">
        <thead>
        <tr>
          <th scope="col">id</th>
          <th scope="col">Nombre</th>
          <th scope="col">Apellidos</th>
          <th scope="col">Correo</th>
          <th scope="col">Acciones</th>
        </tr>
      </thead>
      <tbody>
       {
          clientesList.map((val,key)=>{
            return <tr key={val.id}>
                    <th>{val.id}</th>
                    <td>{val.nombre}</td>
                    <td>{val.apellido}</td>
                    <td>{val.correo}</td>
                    <td>
                      <div className="btn-group" role="group" aria-label="Basic example">
                        <button type="button" 
                        onClick={()=>{
                          editarCliente(val);
                        }}
                        className="btn btn-info">Editar</button>
                        <button type="button" onClick={()=>{
                          deleteClient(val);
                        }} className="btn btn-danger">Eliminar</button>
                      </div>
                    </td>
                  </tr>
          })
        }
      </tbody>
    </table>

    </div>
  );
}

export default App;
