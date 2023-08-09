import './profile.css';

import { toast } from 'react-toastify';

import {doc, updateDoc} from 'firebase/firestore';
import {db, storage} from '../../services/firebaseConnection';
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';

import Header from "../../components/Header";
import Title from "../../components/Title";

import {AuthContext} from "../../contexts/auth";
import { useContext, useState} from "react";

import avatar from "../../assets/avatar.png";

import {FiSettings,FiUpload} from 'react-icons/fi'

export default function Profile(){

    const {user, storageUser, setUser, logout} = useContext(AuthContext);

   const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
   const [imageAvatar, setImageAvatar] = useState(null);

   const [nome,setNome] = useState(user && user.nome);
   const [email,setEmail] = useState(user && user.email);

   function handleFile(e){
    if(e.target.files[0]){
      const image = e.target.files[0];

      if(image.type === 'image/jpeg' || image.type === 'image/png'){
        setImageAvatar(image);
        setAvatarUrl(URL.createObjectURL(image));
      }else{
        alert("Envie uma imagem do tipo PNG ou JPEG")
        setImageAvatar(null)
        return;
      }
    }
   }

   async function handleUpload(){
    const currentUid = user.uid;

    const uploadRef = ref(storage, `images/${currentUid}/${imageAvatar.name}`)

    const uploadTask = uploadBytes(uploadRef, imageAvatar)
    .then((snapshot)=>{
      getDownloadURL(snapshot.ref).then(async(DownloadURL)=>{
        let urlFoto = DownloadURL;

        const docRef = doc(db, 'users', user.uid)
        await updateDoc(docRef,{
          avatarUrl: urlFoto,
          nome: nome,
        })
        .then(()=>{
          let data = {
            ...user,
            nome: nome,
            avatarUrl: urlFoto,
          }
  
        setUser(data);
        storageUser(data);
        toast.success("Atualizado com Sucesso !")

        })
      })
    })

   }

   async function handleSubmit(e){

    e.preventDefault();


    if(imageAvatar === null && nome !== ''){
      const docRef = doc(db, "users", user.uid)
      await updateDoc(docRef, {
        nome: nome,
      })
      .then(() => {
        let data = {
          ...user,
          nome: nome,
        }

      setUser(data);
      storageUser(data);
      toast.success("Atualizado com Sucesso !")
      })

      
    }else if(imageAvatar !== null && nome !== ''){
      handleUpload();
    }
   }

  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Minha Conta">
          <FiSettings size={25}/>
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleSubmit}>
            <label className="label-avatar">
              <span>
                <FiUpload color="#FFF" size={25}/>
              </span>

              <input type="file" accept="image/*" onChange={handleFile}/> <br/>
              {avatarUrl == null ?(
               <img src={avatar} alt="foto de perfil" width={250} height={250}/>)
               : (
               <img src={avatarUrl} alt="foto de perfil" width={250} height={250}/>
               )}

            </label>

            <label>Nome</label>
            <input type='text' value={nome}
            onChange={(e) => setNome(e.target.value)}/>

            <label>Email</label>
            <input type='text' value={email} disabled={true} />

            <button type='submit'>Salvar</button>

          </form>
        </div>
        <div className='container'>
          <button className='logout-btn' onClick={() => logout() }>
                Sair
          </button>
        </div>
      </div>

     
    </div>
  );
}