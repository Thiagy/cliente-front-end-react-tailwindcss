import { useEffect, useState, useRef} from 'react'
import {FiTrash} from 'react-icons/fi'
import { api } from './services/api'

export default function App() {

  const [customers, setCustomers] = useState([])
  const nameRef = useRef(null)
  const emailRef = useRef(null)

  useEffect(()=>{

    loadCustomers()

  }, [])

  //Função que permite carregar lista de clientes
  async function loadCustomers(){

    const response = await api.get("/customers")

    setCustomers(response.data)

  }

  //Função que permite adicionar cliente
  async function handleSubmit(event) {

    event.preventDefault();
    const name = nameRef.current.value;
    const email = emailRef.current.value;
  
    try {

      await api.post('/customer', {

        name,
        email
      });
  
      loadCustomers();

      nameRef.current.value=''
      emailRef.current.value=''

    } catch (error) {

      console.error('Error creating customer:', error);

    }

  }

  async function handleDeleteClient(id) {

     try {

       await api.delete("/customer", { 
        params:{
          id:id
        }
      });
       
       loadCustomers();

     } catch (error) {

       console.error('Error deleting customer:', error);

     }

}
  

  return (

    <div className="w-full min-h-screen bg-gray-900 flex justify-center px-4">
      <main className="my-10 w-full md:max-w-2xl">
        
        <h1 className="text-4xl font-medium text-white">Clientes</h1>

        <form className="flex flex-col my-6" onSubmit={(e)=>{handleSubmit(e)}}>

          <label htmlFor="" className="font-medium text-white">Nome:</label>
          <input 
            type="text" 
            placeholder="Digite seu nome completo..."
            className="w-full mb-5 p-2 rounded"
            ref={nameRef}
          />

          <label htmlFor="" className="font-medium text-white">Email:</label>
          <input 
            type="email" 
            placeholder="Digite seu email" 
            className="w-full mb-5 p-2 rounded"
            ref={emailRef}
            />

          <input type="submit" value="Cadastar" className="cursor-pointer w-full p-2 bg-green-500 rounded font-medium"/>

        </form>

        <section className="flex flex-col gap-4">
          {customers.map((client) => {
              return (
                <article className="w-full bg-white rounded p-2 relative hover:scale-105 duration-200" key={client.id}>
                  <p><span className="font-medium">Nome:</span>{client.name}</p>
                  <p><span className="font-medium">Email:</span>{client.email}</p>
                  <p><span className="font-medium">Status:</span>{client.status==="true"? "Ativo":"Inativo" }</p>
                  <button
                    className='bg-red-500 w-7 h-7 flex items-center justify-center rounded-lg absolute right-0 -top-2'
                    onClick={() => handleDeleteClient(client.id)}
                  >
                    <FiTrash size={18} color='#fff'/>
                  </button>
                </article>
              );
          })}
        </section>

      </main>
    </div>

  )

}