import Header from '../../components/Header';
import Title from '../../components/Title';

import { FiPlusCircle } from 'react-icons/fi';

import { useState,useEffect, useContext } from 'react';

import './new.css';

import { useParams, useNavigate } from 'react-router-dom';

import { AuthContext } from '../../contexts/auth';

import { db } from '../../services/firebaseConnection';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc  } from 'firebase/firestore';

import {toast} from 'react-toastify'

const listRef = collection(db,"customers");

export default function New(){
  const {user} = useContext(AuthContext);
  const {id} = useParams();
  const navigate = useNavigate();
  
  const [custumers,setCustumers] = useState([]);
  const [loadCustomer,setLoadCustomer] = useState(true);
  const [customerSelected, setCustomerSelected] = useState(0);

  const [complemento,setComplemento] = useState('');
  const [assunto,setAssunto] = useState('Suporte');
  const [status,setStatus] = useState('Aberto');

  const[idCustomer,setIdCustomer] = useState(false);

  useEffect(()=>{
    async function loadCustomer(){
      const querySnapshot = await getDocs(listRef)
      .then((snapshot)=>{
        let lista = [];

        snapshot.forEach((doc) =>{
          lista.push({
            id: doc.id,
            nomeFantasia: doc.data().nomeFantasia,
          })
        })

        if(snapshot.docs.size == 0){
          console.log("Nenhuma empresa encontrada");
          setCustumers([{id:'1', nomefantasia:'Freela'}]);
          setLoadCustomer(false);
          return;
        }

        setCustumers(lista);
        setLoadCustomer(false);

        if(id){
          loadId(lista);
        }
        
      })
      .catch((error)=>{
        console.log("ERROR ao buscar os clientes", error)
        setLoadCustomer(false);
        setCustumers([{id:'1', nomefantasia:'Freela'}])
      })
    }
    loadCustomer();
  },[id])

  async function loadId(lista){
    const docRef = doc(db,'chamados',id)
    await getDoc(docRef)
    .then((snapshot)=>{
      setAssunto(snapshot.data().assunto)
      setStatus(snapshot.data().status)
      setComplemento(snapshot.data().complemento)

      let index = lista.findIndex(item => item.id === snapshot.data().clienteId)

      setCustomerSelected(index);
      setIdCustomer(true);
    })
    .catch((error)=>{
      console.log(error);
      setIdCustomer(false);
    })
  }

  function handleOptionChange(e){
    setStatus(e.target.value);
    console.log(e.target.value)
  }

  function handleChangeSelect(e){
    setAssunto(e.target.value);
    console.log(e.target.value)
  }

  function handleChangeCustomer(e){
    setCustomerSelected(e.target.value);
    console.log(e.target.value);
  }

  async function handleRegister(e){
    e.preventDefault();

    if(idCustomer){
      const docRef = doc(db,'chamados',id)
      await updateDoc(docRef,{
        cliente: custumers[customerSelected].nomeFantasia,
        clienteId: custumers[customerSelected].id,
        assunto: assunto,
        complemento: complemento,
        status: status,
        user: user.uid,
      })
      .then(()=>{
        toast.info("Chamado atualizado com sucesso !")
        setCustomerSelected(0);
        setComplemento('');
        navigate('/dashboard')
      })
      .catch((error)=>{
        toast.error("Erro ao atualizar o chamador");
        console.log(error);
      })

      return;
    }

    await addDoc(collection(db,"chamados"),{
      created: new Date(),
      cliente: custumers[customerSelected].nomeFantasia,
      clienteId: custumers[customerSelected].id,
      assunto: assunto,
      complemento: complemento,
      status: status,
      user: user.uid,
    })
    .then(()=>{
      toast.success("Chamado registrado !")
      setComplemento('');
      setCustomerSelected(0);
    })
    .catch((error)=>{
      console.log(error);
      toast.error("Erro ao registrar, tente mais tarde !")
    })
  }



  return(
    <div>
      <Header/>
      <div className='content'>
        <Title name={id ? "Editando Chamado" : "Novo Chamado"}>
          <FiPlusCircle size={25} />
        </Title>

        <div className='container'>
          <form className='form-profile' onSubmit={handleRegister}>

            <label>Cliente</label>
            {
              loadCustomer ? (
                <input type='text' disabled="true" value="Carregando"/>
              ) : (
                <select value={customerSelected} onChange={handleChangeCustomer}>
                  {
                    custumers.map((item, index)=>{
                      return(
                        <option key={index} value={index}>
                          {item.nomeFantasia}
                        </option>
                      );
                    })
                  }
                </select>
              )
            }

            <label>Assunto</label>
            <select value={assunto} onChange={handleChangeSelect}>
              <option value="Manutenção Ar-Condicionado">Manutenção Ar-Condicionado</option>
              <option value="Instalação Ar-Condicionado">Instalação Ar-Condicionado</option>

              <option value="Manutenção Computador">Manutenção Computador</option>
              <option value="Instalação Computador">Instalação Computador</option>
              <option value="Configuração Computador">Configuração Computador</option>

              <option value="Manutenção Impressora">Manutenção Impressora</option>
              <option value="Instalação Impressora">Instalação Impressora</option>
              <option value="Configuração Impressora">Configuração Impressora</option>

              <option value="Manutenção Redes">Manutenção Redes</option>
              <option value="Instalação Redes">Instalação Redes</option>

              <option value="Manutenção Televisão">Manutenção Televisão</option>
              <option value="Instalação Televisão">Instalação Televisão</option>
              <option value="Configuração Televisão">Configuração Televisão</option>

              <option value="Manutenção Telefonia">Manutenção Telefonia</option>
              <option value="Instalação Telefonia">Instalação Telefonia</option>

              <option value="Manutenção Geladeira">Manutenção Geladeira</option>
              <option value="Instalação Geladeira">Instalação Geladeira</option>

              <option value="Manutenção Micro-ondas">Manutenção Micro-ondas</option>
              <option value="Instalação Micro-ondas">Instalação Micro-ondas</option>
            </select>

            <label>Status</label>
            <div className='status'>
              <input
              type='radio'
              name='radio'
              value='Aberto'
              onChange={handleOptionChange}
              checked={status === 'Aberto'}
              />
              <span>Em aberto</span>

              <input
              type='radio'
              name='radio'
              value='Progresso'
              onChange={handleOptionChange}
              checked={status === 'Progresso'}
              />
              <span>Progresso</span>

              <input
              type='radio'
              name='radio'
              value='Atendido'
              onChange={handleOptionChange}
              checked={status === 'Atendido'}
              />
              <span>Atendido</span>
            </div>

            <label>Complemento</label>
            <textarea
            type='text'
            placeholder='Descreva seu problema (opcional).'
            value={complemento}
            onChange={(e)=> setComplemento(e.target.value)}
            />

            <button type='submit'>Registrar</button>

          </form>

        </div>

      </div>
    </div>
  );
}