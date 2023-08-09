import { Await } from 'react-router-dom';
import { Link } from 'react-router-dom';

import {AuthContext} from '../../contexts/auth'
import{useContext, useState,useEffect} from 'react';

import { FiPlus, FiMessageSquare, FiSearch, FiEdit2 } from 'react-icons/fi';

import"./dashboard.css";

import Header from '../../components/Header';
import Title from '../../components/Title';

import {format} from 'date-fns';

import { orderBy, limit, startAfter, collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';

import Modal from '../../components/Modal';

const listRef = collection(db,'chamados');

export default function DashBoard(){

  const [isEmply, setIsEmply] = useState(false);
  const [lastDocs, setLastDocs] = useState();
  const [chamados,setChamados] = useState([]);
  const [loading,setLoading] = useState(true);
  const [loadingMore,setLoadingMore] = useState(false);
  const [showPostModal,setShowPostModal] = useState(false);
  const[detail,setDetail] = useState(); 

  useEffect(()=>{
    async function loadChamados(){
      const q = query(listRef,orderBy('created','desc'),limit(5));

      const querySnapshot = await getDocs(q);
       await updateState(querySnapshot);

       setLoading(false);

    }
    loadChamados();

    return()=>{

    }
  },[])

  async function updateState(querySnapshot){
    const isCollectionEmpty = querySnapshot.size === 0;

    if(!isCollectionEmpty){
      let lista = [];

      querySnapshot.forEach((doc) =>{
        lista.push({
          id: doc.id,
          assunto: doc.data().assunto,
          cliente: doc.data().cliente,
          clienteId: doc.data().clienteId,
          created: doc.data().created,
          createdFormat: format(doc.data().created.toDate(),'dd/MM/yyyy'),
          status:doc.data().status,
          complemento:doc.data().complemento,
        })
      })

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      

      setChamados(chamados => [...chamados, ...lista]);

      setLastDocs(lastDoc);
      
    }else{
      setIsEmply(true);
    }

    setLoadingMore(false);
  }

  async function handleMore(){
    setLoadingMore(true);

    const q = query(listRef,orderBy('created','desc'), startAfter(lastDocs), limit(5));
    const querySnapshot = await getDocs(q);
    await updateState(querySnapshot);
  }

  function toggleModal(item){
    setShowPostModal(!showPostModal)
    setDetail(item)
  }

  if(loading){
    return(
      <div>
        <Header/>
        <div className='content'>
          <Title  name="Tickets">
            <FiMessageSquare size={25}/>
          </Title>

          <div className='container dashboard'>
            <span>Buscando chamados</span>
          </div>
        </div>
      </div>
    );
  }

  return(
    <div>
      <Header/>
      <div className='content'>
        <Title  name="Tickets">
          <FiMessageSquare size={25}/>
        </Title>

        <>

          {
            chamados.length === 0 ? (
              <div className='container dashboard'>
                <span> Nenhum chamado encontrado...</span>
                <Link to='/new' className='new'>
                  <FiPlus color='#FFF' size={25}/>
                  Novo chamado
                </Link>
              </div>
            ) : (
              <>
                <Link to='/new' className='new'>
                  <FiPlus color='#FFF' size={25}/>
                  Novo chamado
                </Link>

                <table>
                  <thead>
                    <tr>
                      <th scope='col'>Cliente</th>
                      <th scope='col'>Assunto</th>
                      <th scope='col'>Status</th>
                      <th scope='col'>Cadastrado em</th>
                      <th scope='col'>#</th>
                    </tr>
                  </thead>

                  <tbody>
                    {chamados.map((item, index)=>{
                      return(
                        <tr key={index} >
                          <td data-label='Cliente'>{item.cliente}</td>
                          <td data-label='Assunto'>{item.assunto}</td>
                          <td data-label='Status'>
                            <span className='badge' style={{backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999'}}>
                              {item.status}
                            </span>
                          </td>
                          <td data-label='Cadastrado'>{item.createdFormat}</td>
                          <td data-label='#'>
                            <button onClick={() => toggleModal(item)} className='action' style={{backgroundColor: '#3583f6'}}>
                              <FiSearch color='#FFF' size={17}/>
                            </button>
                            <Link to={`/new/${item.id}`} className='action' style={{backgroundColor: '#f6a935'}}>
                              <FiEdit2 color='#FFF' size={17}/>
                            </Link>
                          </td>
                        </tr>

                      );
                    })}
                  </tbody>
                </table>

                {loadingMore && <h3>Buscando mais chamados...</h3>}
                {!loadingMore && !isEmply && <button className='btn-more' onClick={handleMore}>Buscar mais</button> }
               </>
            )
          }

        </>
      </div>

      {showPostModal && (
        <Modal
          conteudo={detail}
          close={()=>setShowPostModal(!showPostModal)}
        />
      )}
      
    </div>
  );
}

