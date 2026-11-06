import {firebaseConfig,ROOM} from './config.js';
export class Community{
 constructor(callbacks){this.cb=callbacks;this.revision=0;this.canSave=false;this.live=false;this.stops=[];this.pending=null;this.timer=null;this.chain=Promise.resolve();this.errors={};}
 report(key,value){const was=this.errors[key];this.errors[key]=value;const error=this.errors.chat||this.errors.presence||this.errors.connection;if(error||was)this.cb.status(error||'Đã kết nối cộng đồng');}
 async connect(){
  if(!firebaseConfig.databaseURL){this.cb.status('Đang chơi trên trình duyệt');return;}
  try{
   const [appSDK,authSDK,dbSDK]=await Promise.all([import('https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js'),import('https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js'),import('https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js')]);
   this.A=authSDK;this.D=dbSDK;this.app=appSDK.initializeApp(firebaseConfig);this.auth=authSDK.getAuth(this.app);this.db=dbSDK.getDatabase(this.app);
   await this.auth.authStateReady();if(!this.auth.currentUser)await authSDK.signInAnonymously(this.auth);
   await this.prepareAccount(false);this.startRoom();
  }catch(e){console.error(e);this.cb.error('Không kết nối được Firebase. Bạn vẫn có thể tu tập và lưu trên trình duyệt.');this.report('connection','Chưa kết nối cộng đồng');}
 }
 async prepareAccount(transfer){
  const {get,ref,set,serverTimestamp}=this.D,user=this.auth.currentUser;this.canSave=false;this.revision=0;
  if(user.isAnonymous){this.cb.account({uid:null,guest:true});return;}
  const data=(await get(ref(this.db,`tal_v1/profiles/${user.uid}`))).val();
  let state=this.cb.state(); const stored=!transfer?this.cb.stored(user.uid):null;if(stored)state=stored;
  if(data?.state){const differs=stored && JSON.stringify(stored)!==JSON.stringify(data.state);const choice=(transfer||differs)?await this.cb.choose(state,data.state):'cloud';
   if(choice==='cloud'){state=data.state;this.cb.load(state,user.uid)}else{this.cb.backup(data.state,'cloud');this.cb.load(state,user.uid);this.cb.account({uid:user.uid,guest:false});}
   this.revision=data.revision||0;
  }else{this.cb.load(state,user.uid);this.cb.account({uid:user.uid,guest:false});await set(ref(this.db,`tal_v1/profiles/${user.uid}`),{state,revision:1,updatedAt:serverTimestamp()});this.revision=1;}
  this.canSave=true;this.cb.account({uid:user.uid,guest:false});if(transfer||stored)this.queue(this.cb.state());
 }
 startRoom(){
  this.stopRoom();this.lastWorld=null;const D=this.D;this.session=crypto.randomUUID();this.ownRef=D.ref(this.db,`tal_v1/rooms/${ROOM}/presence/${this.auth.currentUser.uid}/${this.session}`);
  this.stops.push(D.onValue(D.ref(this.db,'.info/connected'),async snap=>{this.live=!!snap.val();if(!this.live){this.report('connection','Đã ngắt kết nối cộng đồng');return;}try{await D.onDisconnect(this.ownRef).remove();await this.publish(true);this.report('connection',null);}catch(e){this.report('presence','Chưa kết nối người chơi');console.error(e)}}));
  this.stops.push(D.onValue(D.query(D.ref(this.db,`tal_v1/rooms/${ROOM}/messages`),D.orderByChild('createdAt'),D.limitToLast(60)),snap=>{const values=[];snap.forEach(child=>values.push({id:child.key,...child.val()}));this.cb.messages(values);this.report('chat',null)},e=>{console.error(e);this.report('chat','Chat chưa kết nối — kiểm tra cấu hình') }));
  this.stops.push(D.onValue(D.ref(this.db,`tal_v1/rooms/${ROOM}/presence`),snap=>{const all=snap.val()||{},flat={};for(const [uid,sessions]of Object.entries(all))for(const[id,value]of Object.entries(sessions||{}))flat[id]={...value,uid};this.cb.players(flat,this.session);this.report('presence',null)},e=>{console.error(e);this.report('presence','Chưa tải được người chơi')}));
  this.interval=setInterval(()=>this.publish().catch(()=>this.report('presence','Mất kết nối người chơi')),250);
 }
 async stopRoom(){if(this.interval)clearInterval(this.interval);this.interval=null;for(const stop of this.stops)stop();this.stops=[];const ref=this.ownRef;this.ownRef=null;if(ref&&this.D)await this.D.remove(ref).catch(()=>{});}
 async publish(force=false){if(!this.live||!this.ownRef||this.publishing)return;const payload=this.cb.world();if(!payload)return;const signature=JSON.stringify(payload);if(!force&&signature===this.lastWorld)return;const ownRef=this.ownRef;this.publishing=true;try{await this.D.set(ownRef,{...payload,updatedAt:this.D.serverTimestamp()});if(this.ownRef===ownRef)this.lastWorld=signature;}finally{this.publishing=false;}}
 async send(text){if(!this.db||!this.live)throw Error('Bạn đang ngoại tuyến. Tin nhắn được giữ lại để gửi khi có kết nối.');await this.D.push(this.D.ref(this.db,`tal_v1/rooms/${ROOM}/messages`),{uid:this.auth.currentUser.uid,name:this.cb.state().name,text,createdAt:this.D.serverTimestamp()});}
 queue(state){if(!this.canSave||!this.auth?.currentUser||this.auth.currentUser.isAnonymous)return;this.pending=JSON.parse(JSON.stringify(state));clearTimeout(this.timer);this.cb.saveStatus('Đã lưu trên máy · đang đồng bộ…');this.timer=setTimeout(()=>this.flush().catch(e=>this.saveError(e)),1500);}
 saveError(e){console.error(e);this.cb.saveStatus('Chưa đồng bộ lên tài khoản. Bản trên máy vẫn được giữ.');}
 async flush(){clearTimeout(this.timer);if(!this.pending||!this.canSave)return this.chain;const state=this.pending;this.pending=null;const uid=this.auth.currentUser.uid;this.chain=this.chain.catch(()=>{}).then(async()=>{
   if(!this.canSave||this.auth.currentUser.uid!==uid)return;
   const expected=this.revision,result=await this.D.runTransaction(this.D.ref(this.db,`tal_v1/profiles/${uid}`),old=>{if(old&&old.revision!==expected)return;return {state,revision:expected+1,updatedAt:this.D.serverTimestamp()}},{applyLocally:false});
   if(result.committed){this.revision=expected+1;this.cb.saveStatus('Đã đồng bộ tài khoản');}
   else{this.canSave=false;this.pending=null;clearTimeout(this.timer);this.cb.backup(state,'local');const remote=result.snapshot.val();const choice=await this.cb.choose(state,remote.state);this.revision=remote.revision;if(choice==='cloud')this.cb.load(remote.state,uid);else this.cb.backup(remote.state,'cloud');this.canSave=true;this.queue(this.cb.state());}
  });return this.chain;
 }
 async login(){if(!this.auth){this.cb.error('Cần hoàn tất cấu hình Firebase theo file hướng dẫn để dùng đăng nhập Google.');return;}
  const local=this.cb.state();this.cb.backup(local,'guest');this.cb.busy(true);
  try{await this.stopRoom();if(this.auth.currentUser.isAnonymous){try{await this.A.linkWithPopup(this.auth.currentUser,new this.A.GoogleAuthProvider())}catch(e){if(e.code!=='auth/credential-already-in-use')throw e;const credential=this.A.GoogleAuthProvider.credentialFromError(e);if(!credential)throw e;await this.A.signInWithCredential(this.auth,credential)}}await this.prepareAccount(true);this.startRoom();this.cb.saveStatus('Đã kết nối tài khoản Google');}
  catch(e){console.error(e);this.canSave=false;this.cb.error(e.code==='auth/popup-closed-by-user'?'Bạn đã đóng cửa sổ đăng nhập.':'Đăng nhập chưa hoàn tất. Tiến trình trên máy đã được giữ lại.');}finally{if(this.auth?.currentUser&&!this.interval)this.startRoom();this.cb.busy(false);}
 }
 async logout(){if(!this.auth)return;this.cb.busy(true);try{await this.flush();this.canSave=false;await this.stopRoom();await this.A.signOut(this.auth);await this.A.signInAnonymously(this.auth);this.cb.guest();this.cb.account({uid:null,guest:true});this.startRoom();}catch(e){this.cb.error('Chưa đăng xuất được. Vui lòng thử lại.');}finally{this.cb.busy(false)}}
}
