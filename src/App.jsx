import React, { useState, useEffect } from 'react';
import { 
  Heart, BookOpen, Monitor, Baby, Menu, X, Mail, Phone, MapPin, 
  ChevronRight, Github, Instagram, Facebook, Copy, Check, QrCode, 
  Users, Target, Smile, Laptop, GraduationCap, Sparkles, Calendar, 
  Clock, ArrowLeft, Camera, HandHeart, ExternalLink, Send, 
  UserCircle, ClipboardList, Trash2, Search, Filter, ShieldCheck,
  MapPinned, GraduationCap as SchoolIcon, FileText, Info,
  BarChart3, Download, Eye, CheckCircle2, AlertCircle, MessageSquare, List,
  Tag, CalendarDays, Quote, HelpCircle, Lock, Unlock, CheckCircle, User,
  Award, Printer, FileCheck, Upload
} from 'lucide-react';

// --- CONFIGURAÇÕES GLOBAIS ---
const TIME_SLOTS = ["09:00", "11:00", "14:00", "16:00"];
const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const PIX_KEY = "00.000.000/0001-00";

const App = () => {
  // --- ESTADOS DE NAVEGAÇÃO E DADOS ---
  const [currentView, setCurrentView] = useState('home'); 
  const [selectedCourseId, setSelectedCourseId] = useState('informatica');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [messages, setMessages] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- ESTADOS DE AUTENTICAÇÃO ---
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  // --- ESTADOS DE FILTRO DO DASHBOARD ---
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [filterCourse, setFilterCourse] = useState('Todos');
  const [filterTurma, setFilterTurma] = useState('Todos');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [dashboardTab, setDashboardTab] = useState('alunos'); 
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  // --- DADOS ESTÁTICOS ---
  const values = [
    {
      title: "Educação Libertadora",
      description: "Acreditamos que o conhecimento é a chave para a verdadeira autonomia e liberdade individual.",
      icon: <BookOpen className="w-6 h-6" />
    },
    {
      title: "Alegria como Método",
      description: "O aprendizado acontece de forma mais profunda quando há acolhimento e felicidade no processo.",
      icon: <Smile className="w-6 h-6" />
    },
    {
      title: "Inclusão Social",
      description: "Ninguém deve ficar para trás. Nossa missão é reduzir as desigualdades através do ensino.",
      icon: <Users className="w-6 h-6" />
    }
  ];

  const testimonials = [
    {
      name: "Dona Maria, 62 anos",
      text: "Eu não sabia ler o nome do autocarro. Hoje, graças ao Instituto, eu escrevo cartas para os meus netos. Mudou a minha vida!",
      role: "Aluna de Alfabetização",
      image: "https://images.unsplash.com/photo-1544120190-27583f22744c?auto=format&fit=crop&q=80&w=200"
    },
    {
      name: "Ricardo Silva, 19 anos",
      text: "Consegui o meu primeiro emprego como auxiliar de escritório depois do curso de informática básica. Foi a porta que eu precisava.",
      role: "Aluno de Informática",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
    }
  ];

  const projectDetails = {
    informatica: {
      title: "Informática Básica",
      tag: "Inclusão Digital",
      icon: <Laptop size={48} />,
      color: "blue",
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=1000",
      description: "A exclusão digital é um isolamento social. Nosso laboratório oferece o conhecimento técnico necessário.",
      longText: "Preparamos o aluno para o mercado moderno, desde o hardware básico até ferramentas de produtividade e LinkedIn.",
      benefits: ["Windows/Linux", "Pacote Office", "Criação de Currículo", "LinkedIn", "Internet Segura"],
      info: { duration: "3 meses", hours: "60h totais", target: "Jovens e Adultos" }
    },
    eja: {
      title: "Alfabetização (EJA)",
      tag: "Dignidade e Resgate",
      icon: <GraduationCap size={48} />,
      color: "green",
      image: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&q=80&w=1000",
      description: "Nunca é tarde para descobrir o mundo através das letras. Focamos na dignidade e na autonomia prática.",
      longText: "Alfabetizar um adulto é devolver-lhe a voz na sociedade. Focamos na leitura funcional e no orgulho de assinar o nome.",
      benefits: ["Método Afetivo", "Matemática do Quotidiano", "Interpretacão de Textos", "Cidadania", "Apoio Encceja"],
      info: { duration: "Contínuo", hours: "4h semanais", target: "Adultos e Idosos" }
    },
    infantil: {
      title: "Educação Infantil",
      tag: "Futuro e Proteção",
      icon: <Sparkles size={48} />,
      color: "yellow",
      image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=1000",
      description: "A infância é o solo onde plantamos o amanhã. Oferecemos um contraturno escolar lúdico e seguro.",
      longText: "Através de artes, música e reforço pedagógico lúdico, garantimos um ambiente de paz e aprendizado alegre.",
      benefits: ["Reforço Criativo", "Oficinas de Arte", "Música", "Horta Educativa", "Apoio Familiar"],
      info: { duration: "Anual", hours: "Segunda a Sexta", target: "Crianças 6-12 anos" }
    }
  };

  // --- PERSISTÊNCIA LOCAL ---
  useEffect(() => {
    const savedData = localStorage.getItem('alegria_viver_db');
    if (savedData) {
      const parsedData = JSON.parse(savedData).map(reg => ({
        ...reg,
        attendance: reg.attendance || Array(10).fill(false) 
      }));
      setRegistrations(parsedData);
    }
    
    const savedMessages = localStorage.getItem('alegria_viver_messages');
    if (savedMessages) setMessages(JSON.parse(savedMessages));

    const sessionAuth = sessionStorage.getItem('alegria_admin_auth');
    if (sessionAuth === 'true') setIsAdmin(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('alegria_viver_db', JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem('alegria_viver_messages', JSON.stringify(messages));
  }, [messages]);

  // --- FUNÇÕES DE AUXÍLIO ---

  const handleCopyPix = () => {
    const textArea = document.createElement("textarea");
    textArea.value = PIX_KEY;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    document.body.removeChild(textArea);
  };

  const handleToggleAttendance = (studentId, dayIndex) => {
    setRegistrations(prev => prev.map(reg => {
      if (reg.id === studentId) {
        const newAttendance = [...reg.attendance];
        newAttendance[dayIndex] = !newAttendance[dayIndex];
        return { ...reg, attendance: newAttendance };
      }
      return reg;
    }));
  };

  const calculateAttendancePercentage = (attendanceArr) => {
    if (!attendanceArr) return 0;
    const presents = attendanceArr.filter(v => v).length;
    return Math.round((presents / 10) * 100);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (loginForm.email === 'admin@alegria.org' && loginForm.password === 'alegria123') {
      setIsAdmin(true);
      sessionStorage.setItem('alegria_admin_auth', 'true');
    } else {
      alert("Credenciais incorretas!");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('alegria_admin_auth');
    setLoginForm({ email: '', password: '' });
    navigateTo('home');
  };

  const toggleMsgRead = (id) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: !m.read } : m));
  };

  const navigateTo = (view, courseId = '') => {
    setCurrentView(view);
    if (courseId) setSelectedCourseId(courseId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const scrollToSection = (id) => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
      }, 200);
    } else {
      const element = document.getElementById(id);
      if (element) window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  // --- SUB-COMPONENTES INTERNOS ---

  const CertificateView = ({ student }) => {
    const percentage = calculateAttendancePercentage(student.attendance);
    return (
      <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center p-4 overflow-y-auto font-sans">
        <div className="absolute top-8 left-8 flex gap-4 no-print">
          <button onClick={() => setSelectedCertificate(null)} className="flex items-center gap-2 px-6 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"><ArrowLeft size={16}/> Voltar</button>
          <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all"><Printer size={16}/> Imprimir Certificado</button>
        </div>
        <div className="max-w-4xl w-full bg-white border-[16px] border-double border-slate-200 p-16 relative shadow-inner aspect-[1.41/1] text-center font-serif">
           <div className="absolute top-4 left-4 text-slate-100"><Heart size={80} className="fill-current"/></div>
           <div className="space-y-8">
              <div className="flex flex-col items-center gap-4 mb-12">
                 <div className="bg-orange-500 p-3 rounded-2xl shadow-md"><Heart className="text-white fill-current" size={40} /></div>
                 <h4 className="uppercase tracking-[0.4em] font-sans font-black text-slate-400 text-sm">Instituto Alegria de Viver</h4>
              </div>
              <h1 className="text-6xl font-black text-slate-800 tracking-tighter italic leading-tight">Certificado de Conclusão</h1>
              <div className="py-12 space-y-6">
                <p className="text-2xl text-slate-600 leading-relaxed italic">Certificamos para os devidos fins que o(a) aluno(a)</p>
                <h2 className="text-5xl font-black text-blue-600 underline decoration-blue-100 underline-offset-8 uppercase font-sans tracking-tight">{student.name}</h2>
                <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto italic">
                  concluiu com êxito o curso livre de <span className="font-black text-slate-800 uppercase not-italic">{projectDetails[student.course]?.title || student.course}</span>, 
                  realizado no ano de 2024, com aproveitamento de <span className="font-black text-orange-600 not-italic">{percentage}%</span> de presença.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-20 pt-20">
                 <div className="border-t border-slate-300 pt-4"><p className="font-sans font-bold text-slate-400 uppercase text-[10px] tracking-widest">Diretoria Pedagógica</p><p className="font-black text-slate-800 italic mt-2">Instituto Alegria de Viver</p></div>
                 <div className="flex flex-col items-center"><div className="w-24 h-24 border-4 border-orange-100 rounded-full flex items-center justify-center text-orange-500 shadow-inner"><Award size={48} /></div><p className="mt-4 font-sans font-black text-[10px] uppercase text-slate-300 tracking-widest italic">Selo de Autenticidade</p></div>
              </div>
           </div>
           <div className="absolute bottom-8 right-8 text-[10px] text-slate-300 font-sans uppercase font-bold tracking-widest italic">Protocolo: {student.id}</div>
        </div>
        <style>{`@media print {.no-print { display: none !important; } body { background: white !important; padding: 0 !important; } @page { size: landscape; margin: 0; }}`}</style>
      </div>
    );
  };

  const AdminLoginComponent = () => (
    <div className="pt-40 pb-20 px-4 min-h-screen bg-slate-100 flex items-center justify-center animate-in fade-in duration-500">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md border border-slate-100 text-center relative overflow-hidden">
        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner"><Lock size={40}/></div>
        <h2 className="text-3xl font-black italic mb-2 tracking-tighter">Acesso ao <span className="text-blue-600">Instrutor</span></h2>
        <p className="text-slate-400 text-sm mb-8 italic">Credenciais: admin@alegria.org / alegria123</p>
        <form onSubmit={handleAdminLogin} className="space-y-4 relative z-10">
          <input required type="email" value={loginForm.email} onChange={(e) => setLoginForm({...loginForm, email: e.target.value})} placeholder="E-mail" className="w-full pl-6 pr-6 py-4 bg-slate-50 rounded-2xl outline-none focus:border-blue-500 font-bold border border-transparent shadow-inner transition-all" />
          <input required type="password" value={loginForm.password} onChange={(e) => setLoginForm({...loginForm, password: e.target.value})} placeholder="Senha" className="w-full pl-6 pr-6 py-4 bg-slate-50 rounded-2xl outline-none focus:border-blue-500 font-bold border border-transparent shadow-inner transition-all" />
          <button type="submit" className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-600 transition-all transition-all">Entrar <Unlock size={20}/></button>
        </form>
      </div>
    </div>
  );

  const ContactFormComponent = () => {
    const [contactData, setContactData] = useState({ name: '', email: '', subject: 'Contato', message: '' });
    const [status, setStatus] = useState('idle');

    const handleSend = (e) => {
      e.preventDefault();
      setStatus('sending');
      setTimeout(() => {
        const newMessage = { ...contactData, id: Date.now().toString(), createdAt: new Date().toISOString(), read: false };
        setMessages(prev => [newMessage, ...prev]);
        setStatus('success');
      }, 1200);
    };

    if (status === 'success') {
      return (
        <div className="py-12 text-center animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm"><Check size={40} /></div>
          <h3 className="text-2xl font-black italic text-slate-800 mb-4 tracking-tighter">Mensagem Enviada!</h3>
          <p className="text-slate-500 font-medium leading-relaxed italic mb-8">A equipa do Instituto Alegria de Viver agradece o seu contacto.</p>
          <button onClick={() => navigateTo('home')} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black uppercase text-xs hover:bg-blue-600 transition-all shadow-md">Voltar para Início</button>
        </div>
      );
    }

    return (
      <form onSubmit={handleSend} className="space-y-5">
        <input required value={contactData.name} onChange={e => setContactData({...contactData, name: e.target.value})} placeholder="Seu Nome" className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none focus:border-orange-500 font-bold border border-transparent transition-all"/>
        <div className="grid md:grid-cols-2 gap-5">
          <input required type="email" value={contactData.email} onChange={e => setContactData({...contactData, email: e.target.value})} placeholder="E-mail" className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none focus:border-orange-500 font-bold border border-transparent transition-all"/>
          <select value={contactData.subject} onChange={e => setContactData({...contactData, subject: e.target.value})} className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold border border-transparent focus:border-orange-500 transition-all cursor-pointer shadow-inner">
            <option value="Contato">Contato Geral</option><option value="Voluntário">Ser Voluntário</option><option value="Outros">Outros</option>
          </select>
        </div>
        <textarea required value={contactData.message} onChange={e => setContactData({...contactData, message: e.target.value})} placeholder="Como podemos ajudar?" className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none focus:border-orange-500 resize-none font-bold border border-transparent shadow-inner transition-all" rows="4"/>
        <button type="submit" disabled={status === 'sending'} className={`w-full py-5 text-white font-black rounded-2xl shadow-lg uppercase transition-all flex items-center justify-center gap-3 ${status === 'sending' ? 'bg-slate-400' : 'bg-orange-500 hover:bg-orange-600'}`}>
          {status === 'sending' ? 'A enviar...' : <>Enviar Mensagem <Send size={20} /></>}
        </button>
      </form>
    );
  };

  const RegistrationPageComponent = () => {
    const [formData, setFormData] = useState({
      name: '', birthDate: '', cpf: '', rg: '', email: '', phone: '', escolaridade: 'Ensino Médio Incompleto',
      cep: '', logradouro: '', numero: '', bairro: '', cidade: '', estado: '',
      course: selectedCourseId, time: '09:00', turma: MONTHS[new Date().getMonth()],
      lgpdConsent: false
    });
    const [status, setStatus] = useState('idle');
    const [lastProtocol, setLastProtocol] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.lgpdConsent) return alert("Aceite os termos da LGPD para continuar!");
      setStatus('sending');
      const protocol = `AV${Math.floor(Math.random() * 90000) + 10000}`;
      setLastProtocol(protocol);
      setTimeout(() => {
        const count = registrations.filter(r => r.course === formData.course && r.time === formData.time && r.turma === formData.turma).length;
        const initialStatus = count < 16 ? 'Aprovado' : 'Lista de Espera';
        const newReg = { ...formData, id: protocol, createdAt: new Date().toISOString(), status: initialStatus, attendance: Array(10).fill(false) };
        setRegistrations(prev => [newReg, ...prev]);
        setStatus('success');
      }, 1500);
    };

    if (status === 'success') {
      const currentReg = registrations[0] || {};
      const isApproved = currentReg.status === 'Aprovado';
      return (
        <div className="pt-40 pb-20 px-4 flex items-center justify-center min-h-screen bg-slate-50 font-sans">
          <div className="bg-white max-w-2xl w-full p-10 lg:p-16 rounded-[4rem] shadow-2xl border border-slate-100 text-center animate-in zoom-in duration-500 relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-3 ${isApproved ? 'bg-green-500' : 'bg-orange-500'}`}></div>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner ${isApproved ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-500'}`}>{isApproved ? <CheckCircle size={56} /> : <Clock size={56} />}</div>
            <h2 className="text-4xl font-black italic text-slate-800 mb-4 tracking-tighter">Inscrição Finalizada!</h2>
            <div className="bg-slate-50 rounded-3xl p-8 mb-10 grid grid-cols-2 gap-6 text-left border border-slate-100 shadow-inner">
               <div><div className="text-[10px] font-black uppercase text-slate-400 mb-1">Protocolo</div><div className="font-black text-xl text-slate-800">#{lastProtocol}</div></div>
               <div><div className="text-[10px] font-black uppercase text-slate-400 mb-1">Status</div><div className={`font-black text-xl ${isApproved ? 'text-green-600' : 'text-orange-500'}`}>{currentReg.status || 'Confirmado'}</div></div>
            </div>
            <button onClick={() => navigateTo('home')} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all shadow-slate-200">Ir para Home</button>
          </div>
        </div>
      );
    }

    return (
      <div className="pt-32 pb-20 px-4 bg-slate-50 min-h-screen font-sans">
        <div className="max-w-5xl mx-auto">
          <button onClick={() => navigateTo('home')} className="flex items-center gap-2 mb-8 text-slate-50 font-bold uppercase text-[10px] tracking-widest hover:text-orange-500 transition-all"><ArrowLeft size={16} /> Voltar</button>
          <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 animate-in slide-in-from-bottom duration-500">
            <div className="bg-slate-900 p-10 text-white relative"><h2 className="text-4xl font-black italic mb-2 relative z-10 tracking-tight italic">Formulário de <span className="text-orange-500">Matrícula</span></h2><div className="absolute right-10 top-10 opacity-10"><UserCircle size={120}/></div></div>
            <form onSubmit={handleSubmit} className="p-8 lg:p-12 space-y-10">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="md:col-span-2 space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 ml-2 italic">Nome Completo</label><input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-3 bg-slate-50 rounded-xl font-bold border-none shadow-inner" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 ml-2 italic">Nascimento</label><input required type="date" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} className="w-full px-5 py-3 bg-slate-50 rounded-xl font-bold border-none shadow-inner" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 ml-2 italic">Escolaridade</label><select value={formData.escolaridade} onChange={e => setFormData({...formData, escolaridade: e.target.value})} className="w-full px-5 py-3 bg-slate-50 rounded-xl font-bold border-none shadow-inner"><option>Fundamental</option><option>Médio</option><option>Superior</option></select></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 ml-2 italic">CPF</label><input required value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} className="w-full px-5 py-3 bg-slate-50 rounded-xl font-bold border-none shadow-inner" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 ml-2 italic">RG</label><input required value={formData.rg} onChange={e => setFormData({...formData, rg: e.target.value})} className="w-full px-5 py-3 bg-slate-50 rounded-xl font-bold border-none shadow-inner" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 ml-2 italic">E-mail</label><input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-3 bg-slate-50 rounded-xl font-bold border-none shadow-inner" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 ml-2 italic">WhatsApp</label><input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-5 py-3 bg-slate-50 rounded-xl font-bold border-none shadow-inner" /></div>
              </div>
              <div className="grid md:grid-cols-4 lg:grid-cols-6 gap-6">
                <div className="md:col-span-2 lg:col-span-3 space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 ml-2 italic">Logradouro</label><input required value={formData.logradouro} onChange={e => setFormData({...formData, logradouro: e.target.value})} className="w-full px-5 py-3 bg-slate-50 rounded-xl font-bold border-none shadow-inner" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 ml-2 italic">Nº</label><input required value={formData.numero} onChange={e => setFormData({...formData, numero: e.target.value})} className="w-full px-5 py-3 bg-slate-50 rounded-xl font-bold border-none shadow-inner" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 ml-2 italic">Bairro</label><input required value={formData.bairro} onChange={e => setFormData({...formData, bairro: e.target.value})} className="w-full px-5 py-3 bg-slate-50 rounded-xl font-bold border-none shadow-inner" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 ml-2 italic">CEP</label><input required value={formData.cep} onChange={e => setFormData({...formData, cep: e.target.value})} className="w-full px-5 py-3 bg-slate-50 rounded-xl font-bold border-none shadow-inner" /></div>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 ml-2 italic">Projeto</label><select value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})} className="w-full px-5 py-3 bg-slate-50 rounded-xl font-bold border-none shadow-inner font-sans"><option value="informatica">Informática</option><option value="eja">EJA</option><option value="infantil">Infantil</option></select></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 ml-2 italic">Turma</label><select value={formData.turma} onChange={e => setFormData({...formData, turma: e.target.value})} className="w-full px-5 py-3 bg-slate-50 rounded-xl font-bold border-none shadow-inner">{MONTHS.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 ml-2 italic">Horário</label><select value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full px-5 py-3 bg-slate-50 rounded-xl font-bold border-none shadow-inner">{TIME_SLOTS.map(t => <option key={t} value={t}>{t}h</option>)}</select></div>
              </div>
              <div className="p-6 bg-slate-900 rounded-3xl text-white flex items-start gap-4 shadow-xl">
                <input required type="checkbox" checked={formData.lgpdConsent} onChange={e => setFormData({...formData, lgpdConsent: e.target.checked})} className="mt-1 w-6 h-6 rounded text-orange-500 cursor-pointer shadow-inner" />
                <p className="text-xs text-slate-400 italic font-medium">Concordo com os termos da LGPD no **Instituto Alegria de Viver**.</p>
              </div>
              <button disabled={status === 'sending'} className="w-full py-6 bg-orange-500 text-white font-black rounded-3xl shadow-xl uppercase italic text-lg hover:bg-orange-600 transition-all transition-all">{status === 'sending' ? 'A Processar...' : 'Finalizar Matrícula'}</button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const InstructorDashboardComponent = () => {
    const handleDeleteReg = (id) => { if(window.confirm("Apagar?")) setRegistrations(prev => prev.filter(r => r.id !== id)); };
    const handleDeleteMsg = (id) => { if(window.confirm("Apagar?")) setMessages(prev => prev.filter(m => m.id !== id)); };
    const handleUpdateStatus = (id, newStatus) => setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));

    const exportToExcel = () => {
      if (registrations.length === 0) return alert("Sem dados.");
      // Planilha modelo completa com todos os campos solicitados
      const headers = ["ID", "Nome Completo", "Nascimento", "CPF", "RG", "Escolaridade", "E-mail", "WhatsApp", "CEP", "Endereço Completo", "Curso", "Turma", "Horário", "Frequência%", "Status"];
      const rows = registrations.map(reg => [
        reg.id, 
        reg.name, 
        reg.birthDate, 
        reg.cpf, 
        reg.rg, 
        reg.escolaridade, 
        reg.email, 
        reg.phone, 
        reg.cep, 
        `${reg.logradouro}, ${reg.numero} - ${reg.bairro} - ${reg.cidade}/${reg.estado}`, 
        projectDetails[reg.course]?.title || reg.course, 
        reg.turma, 
        reg.time, 
        calculateAttendancePercentage(reg.attendance) + "%", 
        reg.status
      ]);
      const csv = [headers.join(";"), ...rows.map(r => r.map(v => `"${v}"`).join(";"))].join("\n");
      const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      link.setAttribute("href", URL.createObjectURL(blob));
      link.setAttribute("download", `relatorio_alegria_viver_v2.csv`);
      link.click();
    };

    const handleCSVImport = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const delimiter = text.includes(';') ? ';' : ',';
        const lines = text.split(/\r?\n/);
        const imported = lines.slice(1).map((line, index) => {
          const cols = line.split(new RegExp(`${delimiter}(?=(?:(?:[^"]*"){2})*[^"]*$)`));
          if (cols.length < 5) return null;
          
          // Mapeamento dinâmico baseado no arquivo do usuário
          const id = (cols[0] || '').replace(/"/g, '') || `AV${index}${Math.floor(Math.random()*100)}`;
          const name = (cols[5] || cols[1] || '').replace(/"/g, '').trim();
          const cpf = (cols[7] || cols[3] || '').replace(/"/g, '').trim();
          const birthDate = (cols[6] || cols[2] || '').replace(/"/g, '').trim();
          
          return {
            id,
            name,
            birthDate,
            cpf,
            rg: (cols[8] || '').replace(/"/g, ''),
            logradouro: (cols[9] || '').replace(/"/g, ''),
            numero: '', bairro: '', cidade: 'São Paulo', estado: 'SP',
            email: (cols[10] || '').replace(/"/g, ''),
            phone: (cols[11] || '').replace(/"/g, ''),
            escolaridade: (cols[12] || '').replace(/"/g, ''),
            course: (cols[14] || '').toLowerCase().includes('informática') ? 'informatica' : 'eja',
            turma: (cols[13] || '').replace(/"/g, '').split(' ')[0],
            time: (cols[15] || '').match(/\d{2}:\d{2}/)?.[0] || '15:30',
            status: 'Aprovado',
            attendance: Array(10).fill(false),
            createdAt: new Date().toISOString()
          };
        }).filter(Boolean);

        setRegistrations(prev => [...imported, ...prev]);
        alert(`${imported.length} alunos importados com sucesso!`);
      };
      reader.readAsText(file);
    };

    const filteredRegs = registrations.filter(r => {
      const matchSearch = (r.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (r.id || '').includes(searchTerm) || (r.cpf || '').includes(searchTerm);
      const matchCourse = filterCourse === 'Todos' || r.course === filterCourse;
      const matchStatus = filterStatus === 'Todos' || r.status === filterStatus;
      const matchTurma = filterTurma === 'Todos' || r.turma === filterTurma;
      return matchSearch && matchCourse && matchStatus && matchTurma;
    });

    const filteredMsgs = messages.filter(m => (m.name || '').toLowerCase().includes(searchTerm.toLowerCase()));

    return (
      <div className="pt-32 pb-20 px-4 min-h-screen bg-slate-50 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 text-center md:text-left">
            <div>
              <h1 className="text-4xl font-black italic tracking-tighter">Gestão <span className="text-blue-600 italic">Administrativa</span></h1>
              <div className="flex flex-wrap gap-3 mt-6 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 w-fit mx-auto md:mx-0">
                <button onClick={() => setDashboardTab('alunos')} className={`px-8 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${dashboardTab === 'alunos' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400'}`}><Users size={16}/> Alunos ({registrations.length})</button>
                <button onClick={() => setDashboardTab('frequencia')} className={`px-8 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${dashboardTab === 'frequencia' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'}`}><BarChart3 size={16}/> Frequência</button>
                <button onClick={() => setDashboardTab('mensagens')} className={`px-8 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${dashboardTab === 'mensagens' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400'}`}><MessageSquare size={16}/> Contatos ({messages.length})</button>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 justify-center md:justify-end">
              <label className="flex items-center gap-2 bg-blue-50 text-blue-600 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-sm border border-blue-100 cursor-pointer hover:bg-blue-600 hover:text-white transition-all"><Upload size={16}/> Importar CSV<input type="file" accept=".csv" onChange={handleCSVImport} className="hidden" /></label>
              <button onClick={exportToExcel} className="flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-2xl font-black uppercase text-[10px] shadow-sm border border-slate-100 transition-all hover:shadow-md"><Download size={16}/> Exportar Excel</button>
              <button onClick={handleLogout} className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><X size={20}/></button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[3rem] shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row gap-6">
             <div className="flex-1 flex items-center gap-2 bg-slate-50 p-4 rounded-2xl border border-transparent focus-within:border-blue-500 transition-all shadow-inner"><Search size={20} className="text-slate-300 ml-2"/><input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder={`Pesquisar por nome, CPF ou protocolo...`} className="bg-transparent outline-none w-full font-bold text-sm" /></div>
             {dashboardTab === 'alunos' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <select value={filterCourse} onChange={e => setFilterCourse(e.target.value)} className="bg-white px-4 py-3 rounded-xl font-bold text-xs border border-slate-100 shadow-sm outline-none"><option value="Todos">Cursos</option><option value="informatica">Info</option><option value="eja">EJA</option><option value="infantil">Ed. Infantil</option></select>
                  <select value={filterTurma} onChange={e => setFilterTurma(e.target.value)} className="bg-white px-4 py-3 rounded-xl font-bold text-xs border border-slate-100 shadow-sm outline-none"><option value="Todos">Turmas</option>{MONTHS.map(m => <option key={m} value={m}>{m}</option>)}</select>
                  <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-white px-4 py-3 rounded-xl font-bold text-xs border border-slate-100 shadow-sm outline-none"><option value="Todos">Status</option><option value="Aprovado">Aprovado</option><option value="Pendente">Pendente</option><option value="Lista de Espera">Espera</option></select>
                </div>
             )}
          </div>

          <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 animate-in slide-in-from-bottom-4 duration-500">
            <div className="overflow-x-auto">
              {dashboardTab === 'alunos' ? (
                <table className="w-full text-left whitespace-nowrap">
                  <thead><tr className="bg-slate-900 text-white text-[10px] uppercase font-black italic tracking-widest"><th className="px-8 py-6 text-center">Protocolo</th><th className="px-8 py-6">Aluno</th><th className="px-8 py-6 text-center">Status</th><th className="px-8 py-6 text-center">Gestão</th></tr></thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {filteredRegs.map(reg => (
                      <tr key={reg.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-8 py-6 text-center font-mono text-[10px] font-black text-blue-500">#{reg.id}</td>
                        <td className="px-8 py-6"><div className="font-bold text-slate-800 text-lg uppercase tracking-tight">{reg.name}</div><div className="text-[10px] text-slate-400 font-medium italic">{reg.cpf} • {projectDetails[reg.course]?.title || reg.course}</div></td>
                        <td className="px-8 py-6 text-center"><select value={reg.status} onChange={e => handleUpdateStatus(reg.id, e.target.value)} className={`text-[10px] font-black uppercase border-none rounded-xl py-2 px-4 shadow-inner transition-all ${reg.status === 'Aprovado' ? 'bg-green-100 text-green-700' : reg.status === 'Lista de Espera' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100'}`}><option>Pendente</option><option>Aprovado</option><option>Lista de Espera</option></select></td>
                        <td className="px-8 py-6 text-center"><div className="flex justify-center gap-3"><button onClick={() => setSelectedStudent(reg)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Eye size={18}/></button><button onClick={() => handleDeleteReg(reg.id)} className="p-3 bg-red-50 text-red-500 rounded-xl transition-all hover:bg-red-500 hover:text-white shadow-sm"><Trash2 size={18} /></button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : dashboardTab === 'frequencia' ? (
                <table className="w-full text-left whitespace-nowrap">
                  <thead><tr className="bg-slate-900 text-white text-[10px] uppercase font-black italic"><th className="px-8 py-6">Aluno</th>{[...Array(10)].map((_, i) => <th key={i} className="px-2 py-6 text-center text-[9px] opacity-60">D{i+1}</th>)}<th className="px-8 py-6 text-center">%</th><th className="px-8 py-6 text-center">Gestão</th></tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRegs.map(reg => {
                      const perc = calculateAttendancePercentage(reg.attendance);
                      return (
                        <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-8 py-6"><div className="font-bold text-slate-800 uppercase italic tracking-tighter italic italic">{reg.name}</div><div className="text-[10px] text-slate-400 font-bold">{projectDetails[reg.course]?.title || reg.course}</div></td>
                          {[...Array(10)].map((_, i) => (<td key={i} className="px-2 py-6 text-center"><button onClick={() => handleToggleAttendance(reg.id, i)} className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${reg.attendance[i] ? 'bg-green-500 border-green-500 text-white scale-110 shadow-lg shadow-green-100' : 'bg-slate-50 border-slate-200 shadow-inner'}`}>{reg.attendance[i] && <Check size={14} />}</button></td>))}
                          <td className="px-8 py-6 text-center"><div className={`font-black text-base ${perc >= 90 ? 'text-green-600' : 'text-slate-400'}`}>{perc}%</div></td>
                          <td className="px-8 py-6 text-center">{perc >= 90 ? <button onClick={() => setSelectedCertificate(reg)} className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-xl font-black text-[10px] uppercase shadow-sm hover:bg-orange-500 hover:text-white transition-all shadow-sm transition-all"><Award size={14}/> Emitir</button> : <span className="text-[10px] font-bold text-slate-300 uppercase italic">Acompanhar</span>}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-left whitespace-nowrap">
                  <thead><tr className="bg-slate-900 text-white text-[10px] uppercase font-black italic tracking-widest"><th className="px-8 py-6">Remetente / Assunto</th><th className="px-8 py-6">Mensagem</th><th className="px-8 py-6 text-center">Ações</th></tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredMsgs.map(msg => (
                      <tr key={msg.id} className={`hover:bg-slate-50 transition-colors ${!msg.read ? 'bg-orange-50/20 shadow-inner' : ''}`}><td className="px-8 py-6"><div className="font-bold text-slate-800 uppercase tracking-tighter italic italic">{msg.name}</div><div className="flex items-center gap-1 mt-1 text-[10px] font-black uppercase text-orange-500"><Tag size={12}/> {msg.subject}</div></td><td className="px-8 py-6 max-w-sm truncate italic text-slate-500 font-medium italic italic italic">"{msg.message}"</td><td className="px-8 py-6 text-center"><div className="flex justify-center gap-3"><button onClick={() => { toggleMsgRead(msg.id); alert(`DE: ${msg.name}\nDATA: ${new Date(msg.createdAt).toLocaleString()}\n\nMENSAGEM:\n${msg.message}`); }} className={`p-3 rounded-xl shadow-sm transition-all ${msg.read ? 'bg-slate-100' : 'bg-orange-500 text-white shadow-md'}`}><Eye size={18}/></button><button onClick={() => handleDeleteMsg(msg.id)} className="p-3 bg-red-50 text-red-500 rounded-xl shadow-sm hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18}/></button></div></td></tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
        {selectedStudent && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-in fade-in duration-300 font-sans">
             <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm shadow-2xl" onClick={() => setSelectedStudent(null)}></div>
             <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden border border-slate-100 animate-in zoom-in duration-300">
                <div className="bg-slate-900 p-8 text-white flex justify-between items-center"><h3 className="text-2xl font-black italic tracking-tighter italic italic italic">Ficha de <span className="text-orange-500 underline decoration-orange-300 decoration-4 underline-offset-8">Matrícula</span></h3><button onClick={() => setSelectedStudent(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"><X /></button></div>
                <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto">
                   <div className="grid grid-cols-2 gap-10">
                      <div className="space-y-4"><div className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b pb-1 italic italic">Identidade Completa</div><div className="text-sm font-black text-slate-800 uppercase italic italic">{selectedStudent.name}</div><div className="text-xs font-bold text-slate-500 font-sans">CPF: <span className="text-slate-800 font-black">{selectedStudent.cpf}</span></div><div className="text-xs font-bold text-slate-500 font-sans">RG: <span className="text-slate-800 font-black">{selectedStudent.rg}</span></div><div className="text-xs font-bold text-slate-500 uppercase italic italic">Escolaridade: <span className="text-slate-800 uppercase font-black">{selectedStudent.escolaridade}</span></div></div>
                      <div className="space-y-4"><div className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b pb-1 italic italic">Vínculo</div><div className="text-sm font-black text-blue-600 italic italic italic">{selectedStudent.phone}</div><div className="text-xs font-bold text-slate-500 uppercase italic italic">Projeto: <span className="text-blue-600 font-black italic italic italic italic">{projectDetails[selectedStudent.course]?.title || selectedStudent.course}</span></div><div className="text-xs font-bold text-slate-500 uppercase italic italic">Horário: <span className="font-black italic italic italic">{selectedStudent.time}h</span></div><div className="text-xs font-bold text-slate-500 uppercase italic italic">Turma: <span className="font-black italic italic italic">{selectedStudent.turma}</span></div></div>
                   </div>
                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner"><div className="text-[10px] font-black text-slate-400 uppercase italic mb-2 flex items-center gap-2 italic italic italic"><MapPin size={12}/> Morada Completa</div><div className="text-sm font-bold text-slate-700 italic font-medium italic italic italic italic">{selectedStudent.logradouro}, nº {selectedStudent.numero} - {selectedStudent.bairro}<br/>{selectedStudent.cidade} / {selectedStudent.estado} • CEP: {selectedStudent.cep}</div></div>
                   <div className="flex items-center gap-3 p-5 bg-green-50 rounded-2xl border border-green-100 text-green-700 shadow-sm shadow-green-50"><ShieldCheck size={24}/><div className="text-[10px] font-black uppercase tracking-tighter leading-relaxed italic italic">Concordância LGPD registrada eletronicamente no ato da matrícula local em {new Date(selectedStudent.createdAt || Date.now()).toLocaleDateString()}.</div></div>
                </div>
                <div className="p-6 border-t border-slate-50 bg-slate-50/50 text-right"><button onClick={() => setSelectedStudent(null)} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-md transition-all hover:bg-blue-600">Fechar Ficha</button></div>
             </div>
          </div>
        )}
        {selectedCertificate && <CertificateView student={selectedCertificate} />}
      </div>
    );
  };

  const ProjectPageComponent = ({ data, id }) => (
    <div className="pt-20 animate-in fade-in duration-700 font-sans">
      <div className={`bg-${data.color}-600 py-20 text-white relative overflow-hidden`}>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <button onClick={() => navigateTo('home')} className="flex items-center gap-2 mb-8 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all w-fit font-bold uppercase text-[10px] tracking-widest transition-all italic"><ArrowLeft size={16} /> Voltar</button>
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="w-24 h-24 rounded-[2.5rem] overflow-hidden shadow-xl shrink-0 bg-white border-4 border-white/20 transition-all hover:scale-105"><img src={data.image} alt={data.title} className="w-full h-full object-cover" /></div>
            <div><span className="uppercase tracking-widest text-xs font-black opacity-80 italic italic italic">{data.tag}</span><h1 className="text-4xl md:text-7xl font-black mt-2 leading-tight italic tracking-tighter italic italic italic">{data.title}</h1></div>
          </div>
        </div>
        <div className="absolute inset-0 opacity-20"><img src={data.image} alt="bg" className="w-full h-full object-cover blur-sm" /></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-16 grid lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-12">
          <section><h2 className="text-4xl font-black mb-8 italic text-slate-800 underline decoration-orange-500 decoration-8 underline-offset-8 italic italic">Sobre o Projecto</h2><p className="text-xl text-slate-600 leading-relaxed mb-8 font-medium italic italic italic italic">{data.description}</p><p className="text-lg text-slate-500 leading-relaxed italic italic italic italic">{data.longText}</p></section>
          <section className={`bg-${data.color}-50 p-10 rounded-[3rem] border border-${data.color}-100`}><h3 className="text-2xl font-black mb-8 italic text-slate-800 italic italic italic italic">Grade Curricular:</h3><div className="grid md:grid-cols-2 gap-4">{data.benefits.map((item, i) => (<div key={i} className="flex items-center gap-4 bg-white p-5 rounded-3xl shadow-sm hover:scale-105 transition-transform"><Check className="text-green-500 shrink-0" size={24} /><span className="font-bold text-slate-700 italic italic italic">{item}</span></div>))}</div></section>
        </div>
        <aside className="space-y-8"><div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden border border-slate-800 shadow-slate-200"><h3 className="text-xl font-black mb-8 border-b border-white/10 pb-4 tracking-widest uppercase italic italic italic italic italic">Info do Curso</h3><div className="space-y-8 font-sans"><div className="flex items-center gap-4"><Calendar className="text-orange-500" /><div><div className="text-[10px] font-black text-slate-500 uppercase">Duração</div><div className="font-black text-lg italic italic italic italic italic">{data.info.duration}</div></div></div><div className="flex items-center gap-4"><Clock className="text-blue-400" /><div><div className="text-[10px] font-black text-slate-500 uppercase">Carga Horária</div><div className="font-black text-lg italic italic italic italic italic">{data.info.hours}</div></div></div><div className="flex items-center gap-4"><Users className="text-green-400" /><div><div className="text-[10px] font-black text-slate-500 uppercase">Público</div><div className="font-black text-lg italic italic italic italic italic">{data.info.target}</div></div></div></div><button onClick={() => navigateTo('registration', id)} className="w-full mt-10 py-5 bg-orange-500 rounded-2xl font-black hover:bg-orange-600 transition-all uppercase tracking-widest italic shadow-xl shadow-orange-900/40 italic">Fazer Inscrição</button></div></aside>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      {/* NAVEGAÇÃO PRINCIPAL */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 shadow-sm border-b border-slate-100 h-20 flex justify-between items-center px-4 lg:px-20">
        <div className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105" onClick={() => navigateTo('home')}><div className="bg-orange-500 p-2 rounded-lg shadow-md shadow-orange-100 shadow-sm"><Heart className="text-white w-6 h-6 fill-current" /></div><span className="text-xl font-black italic tracking-tighter italic italic">Instituto <span className="text-orange-500 italic italic italic">Alegria de Viver</span></span></div>
        <div className="hidden lg:flex items-center space-x-10 font-black text-[10px] uppercase tracking-widest italic italic italic">
          <button onClick={() => navigateTo('home')} className="hover:text-orange-500 transition-colors transition-all italic italic italic">Início</button>
          <button onClick={() => scrollToSection('about')} className="hover:text-orange-500 transition-colors transition-all italic italic italic">Quem Somos</button>
          <button onClick={() => scrollToSection('projects-grid')} className="hover:text-orange-500 transition-colors transition-all italic italic italic">Projectos</button>
          <button onClick={() => scrollToSection('contact')} className="hover:text-orange-500 transition-colors transition-all italic italic italic">Contacto</button>
          <button onClick={() => navigateTo('dashboard')} className="text-blue-600 flex items-center gap-2 transition-all hover:scale-105 italic italic italic"><ShieldCheck size={14}/> Dashboard</button>
          <button onClick={() => setIsDonationModalOpen(true)} className="bg-orange-500 text-white px-8 py-2.5 rounded-full shadow-lg hover:bg-orange-600 transition-all shadow-orange-100 hover:scale-105 italic italic italic">Doe Agora</button>
        </div>
        <div className="lg:hidden"><button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 bg-slate-100 rounded-xl transition-all shadow-sm">{isMenuOpen ? <X /> : <Menu />}</button></div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-8 lg:hidden animate-in slide-in-from-top duration-300 flex flex-col space-y-8 font-black text-3xl italic italic italic">
          <button onClick={() => navigateTo('home')}>Início</button><button onClick={() => scrollToSection('about')}>Quem Somos</button><button onClick={() => scrollToSection('projects-grid')}>Projectos</button><button onClick={() => scrollToSection('contact')}>Contacto</button><button onClick={() => navigateTo('dashboard')} className="text-blue-600 italic italic italic">Dashboard</button><button onClick={() => {setIsDonationModalOpen(true); setIsMenuOpen(false);}} className="w-full bg-orange-500 text-white py-6 rounded-[2rem] shadow-xl uppercase text-xl italic shadow-orange-100 italic italic">Doe Agora PIX</button>
        </div>
      )}

      {/* MODAL DE DOAÇÃO (PIX) */}
      {isDonationModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsDonationModalOpen(false)}></div>
          <div className="bg-white rounded-[3rem] w-full max-w-md p-10 relative z-10 shadow-2xl animate-in zoom-in duration-300 border border-slate-100 font-sans">
            <button onClick={() => setIsDonationModalOpen(false)} className="absolute right-8 top-8 p-2 hover:bg-slate-100 rounded-full transition-colors"><X /></button>
            <div className="text-center space-y-6">
              <div className="bg-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-orange-600 shadow-inner"><Heart className="fill-current" /></div>
              <h3 className="text-2xl font-black mb-4 italic text-slate-800 italic italic italic italic italic">Ajuda com <span className="text-orange-500 underline decoration-orange-100 decoration-4 underline-offset-8 italic italic italic">PIX</span></h3>
              <p className="text-sm text-slate-500 leading-relaxed italic font-medium italic italic italic">Sua doação mantém nosso material gratuito e internet ativa para todos os alunos da comunidade.</p>
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center shadow-inner group relative">
                <QrCode size={180} className="text-slate-800 transition-transform group-hover:scale-110" />
                <span className="text-[10px] font-black text-slate-400 mt-6 tracking-widest uppercase italic italic italic italic italic">Chave PIX: {PIX_KEY}</span>
              </div>
              <button onClick={handleCopyPix} className={`w-full py-5 rounded-2xl font-black transition-all shadow-xl ${copied ? 'bg-green-500 text-white shadow-green-100 shadow-sm' : 'bg-slate-900 text-white hover:bg-blue-600 shadow-slate-100 shadow-sm'}`}>{copied ? <Check size={18} className="inline mr-2" /> : <Copy size={18} className="inline mr-2" />}{copied ? 'Copiado!' : 'Copiar Chave'}</button>
            </div>
          </div>
        </div>
      )}

      <main>
        {currentView === 'home' && (
          <div className="animate-in fade-in duration-1000">
            <section id="home" className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center text-center lg:text-left">
              <div className="animate-in slide-in-from-left duration-700">
                <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 rounded-full text-[10px] font-black mb-6 uppercase tracking-widest italic shadow-sm italic italic italic italic italic italic italic">Transformando Destinos</span>
                <h1 className="text-5xl lg:text-8xl font-black leading-tight mb-8 italic tracking-tighter italic italic italic italic">Onde a educação encontra a <span className="text-orange-500 underline decoration-8 decoration-orange-200 underline-offset-8 italic italic italic italic italic">alegria.</span></h1>
                <p className="text-lg text-slate-600 mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed italic font-medium italic italic italic italic italic italic italic">Alfabetização e Informática Gratuita para quem mais precisa. Juntos, construímos um futuro com dignidade através do conhecimento compartilhado.</p>
                <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                  <button onClick={() => scrollToSection('projects-grid')} className="px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black shadow-xl shadow-slate-200 uppercase text-xs tracking-widest hover:bg-blue-600 transition-all hover:scale-105 italic italic italic">Ver Projectos</button>
                  <button onClick={() => navigateTo('registration')} className="px-12 py-5 border-4 border-orange-500 text-orange-500 rounded-[2rem] font-black hover:bg-orange-50 uppercase text-xs italic tracking-widest transition-all hover:scale-105 italic italic italic italic italic italic italic">Fazer Matrícula <UserCircle size={18} className="inline ml-1"/></button>
                  <button onClick={() => setIsDonationModalOpen(true)} className="px-12 py-5 bg-orange-100 text-orange-600 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-sm hover:scale-105 transition-all italic italic italic italic">Apoiar PIX <Heart size={16} className="inline ml-1 fill-current"/></button>
                </div>
              </div>
              <div className="aspect-square bg-orange-500 rounded-[6rem] shadow-2xl flex items-center justify-center text-white/10 hidden lg:flex transform -rotate-3 hover:rotate-0 duration-700 animate-in zoom-in duration-1000 italic italic italic italic"><Heart size={200} className="fill-current"/></div>
            </section>
            <section id="about" className="py-24 bg-white border-y border-slate-100 scroll-mt-20"><div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-20 items-center"><div className="bg-blue-600 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden group"><div className="relative z-10"><h3 className="text-3xl font-black mb-6 italic underline decoration-blue-400 decoration-4 underline-offset-8 text-white italic italic italic italic italic">Nossa História</h3><p className="leading-relaxed mb-6 opacity-90 text-lg italic italic italic italic italic italic italic">O **Instituto Alegria de Viver** nasceu da convicção de que o acesso à informação básica é um pilar da dignidade social.</p><p className="leading-relaxed opacity-90 text-lg italic font-medium italic italic italic italic italic italic italic">Hoje somos o coração tecnológico e educativo da nossa comunidade, garantindo aprendizado com afeto para todas as idades.</p></div><div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700"></div></div><div><div className="flex items-center gap-2 text-orange-600 font-black mb-6 uppercase tracking-widest text-[10px] italic italic italic italic italic italic italic italic"><Target size={16}/> Quem Somos</div><h2 className="text-4xl lg:text-5xl font-black mb-8 italic text-slate-800 leading-tight italic tracking-tight italic italic italic italic italic">Caminhos entre a <span className="text-blue-600 underline decoration-blue-100 italic italic italic italic italic italic">tecnologia</span> e a <span className="text-orange-500 italic italic italic italic">humanidade</span>.</h2><div className="space-y-6">{values.map((v, i) => (<div key={i} className="flex gap-6 p-6 rounded-[2rem] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group shadow-sm"><div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-inner">{v.icon}</div><div><h4 className="font-bold text-xl mb-1 italic text-slate-800 italic italic italic italic italic italic italic italic italic italic">{v.title}</h4><p className="text-slate-500 text-sm leading-relaxed font-medium italic italic italic italic italic italic italic italic italic italic italic italic">{v.description}</p></div></div>))}</div></div></div></section>
            <section id="projects-grid" className="py-24 bg-slate-50 scroll-mt-20"><div className="max-w-7xl mx-auto px-4 text-center"><h2 className="text-4xl lg:text-7xl font-black mb-20 italic italic italic italic tracking-tight italic italic italic italic italic italic italic italic">Eixos de <span className="text-orange-500 underline decoration-orange-200 decoration-4 underline-offset-8 italic italic italic italic italic italic italic italic italic">Impacto</span></h2><div className="grid md:grid-cols-3 gap-10">{Object.entries(projectDetails).map(([id, p]) => (<div key={id} className="bg-white rounded-[4rem] transition-all hover:shadow-2xl hover:-translate-y-2 border border-slate-100 flex flex-col items-center group shadow-sm overflow-hidden pb-12"><div className="w-full h-64 overflow-hidden mb-8 relative"><img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" /><div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-sm text-slate-800 italic font-black text-[10px] uppercase tracking-widest font-sans italic italic italic italic">{p.tag}</div></div><h3 className="text-3xl font-black mb-4 italic italic tracking-tight italic italic italic italic italic italic italic italic italic italic italic">{p.title}</h3><p className="text-slate-500 text-sm mb-10 px-8 leading-relaxed italic font-medium italic italic italic italic italic italic italic italic italic italic italic italic">{p.description}</p><button onClick={() => navigateTo(id)} className="w-3/4 bg-slate-900 text-white font-black py-5 rounded-[2rem] hover:bg-orange-500 transition-all uppercase text-[10px] italic tracking-widest shadow-lg italic italic italic italic italic italic italic">Ver Detalhes</button></div>))}</div></div></section>
            <section className="py-24 bg-white"><div className="max-w-7xl mx-auto px-4"><div className="text-center mb-16"><div className="flex items-center justify-center gap-2 text-green-600 font-black mb-4 uppercase tracking-widest text-[10px] italic italic italic italic italic italic italic italic italic italic italic"><Quote size={16}/> Depoimentos</div><h2 className="text-4xl lg:text-5xl font-black italic tracking-tighter text-slate-800 italic italic italic italic italic italic italic italic italic italic italic italic">Histórias que nos <span className="text-green-600 underline decoration-green-100 underline-offset-8 italic italic italic italic italic italic italic italic italic italic italic italic">inspiram</span></h2></div><div className="grid md:grid-cols-2 gap-10">{testimonials.map((t, i) => (<div key={i} className="bg-slate-50 p-10 rounded-[3.5rem] border border-slate-100 relative group transition-all hover:shadow-xl hover:bg-white shadow-sm shadow-slate-100 transition-all italic italic italic italic italic italic italic italic italic"><Quote className="text-slate-200 mb-6" size={50} /><p className="text-xl italic text-slate-600 leading-relaxed mb-8 font-medium italic italic italic italic italic italic italic italic italic italic italic italic">"{t.text}"</p><div className="flex items-center gap-4"><img src={t.image} alt={t.name} className="w-16 h-16 rounded-2xl object-cover shadow-md border-2 border-white shadow-sm" /><div><div className="font-black text-slate-800 italic italic italic italic italic italic italic italic italic italic italic italic italic">{t.name}</div><div className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic italic italic italic italic italic italic italic italic italic italic italic italic">{t.role}</div></div></div></div>))}</div></div></section>
            <section id="contact" className="py-24 bg-white scroll-mt-20"><div className="max-w-7xl mx-auto px-4"><div className="bg-slate-50 rounded-[4rem] p-10 lg:p-20 border border-slate-100 grid lg:grid-cols-2 gap-20 shadow-inner relative overflow-hidden"><div className="relative z-10"><h2 className="text-4xl font-black italic mb-8 italic italic italic italic italic italic italic italic italic italic italic italic italic">Fale <span className="text-orange-500 underline decoration-orange-100 decoration-4 underline-offset-8 italic italic italic italic italic italic italic italic italic italic italic italic italic">Connosco</span></h2><p className="text-slate-600 text-lg italic mb-12 font-medium leading-relaxed italic italic italic italic italic italic italic italic italic italic italic italic italic">Dúvidas sobre turmas? Use o formulário ao lado. Sua mensagem irá para o Dashboard administrativo.</p><div className="space-y-10"><div className="flex items-center gap-6 group transition-all hover:translate-x-2 cursor-pointer"><div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-all transform group-hover:rotate-12"><Phone size={24}/></div><div><div className="text-[10px] font-black uppercase text-slate-400 italic italic italic italic italic italic italic italic italic italic italic italic italic">Telefone</div><span className="font-black text-slate-800 text-lg font-sans italic italic italic italic italic italic italic italic italic italic italic italic italic">(11) 99999-9999</span></div></div><div className="flex items-center gap-6 group transition-all hover:translate-x-2 cursor-pointer"><div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:-rotate-12"><Mail size={24}/></div><div><div className="text-[10px] font-black uppercase text-slate-400 italic italic italic italic italic italic italic italic italic italic italic italic italic">E-mail</div><span className="font-black text-slate-800 text-lg text-sm italic lowercase font-medium italic italic italic italic italic italic italic italic italic italic italic italic italic font-sans italic italic italic italic italic italic italic">contato@alegriadeviver.org</span></div></div></div></div><div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 relative z-10 animate-in slide-in-from-right duration-700 shadow-slate-100 transition-all italic italic italic"><ContactFormComponent /></div><div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/30 rounded-full -mr-32 -mt-32 blur-3xl shadow-xl transition-all italic italic italic italic italic"></div></div></div></section>
          </div>
        )}
        {currentView === 'registration' && <RegistrationPageComponent />}
        {currentView === 'dashboard' && (!isAdmin ? <AdminLoginComponent /> : <InstructorDashboardComponent />)}
        {projectDetails[currentView] && <ProjectPageComponent data={projectDetails[currentView]} id={currentView} />}
      </main>

      <footer className="bg-white border-t py-20 font-sans shadow-inner"><div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left"><div className="flex items-center gap-2 cursor-pointer transition-all hover:scale-105" onClick={() => navigateTo('home')}><div className="bg-orange-500 p-2 rounded-lg shadow-sm shadow-orange-100 shadow-sm"><Heart className="text-white w-5 h-5 fill-current" /></div><span className="text-xl font-black italic tracking-tighter text-slate-800 italic italic italic italic italic italic italic italic italic italic italic italic">Instituto <span className="text-orange-500 tracking-tighter italic italic italic italic italic italic italic italic italic italic italic italic italic italic">Alegria de Viver</span></span></div><p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] italic max-w-sm leading-relaxed italic italic italic italic italic italic italic italic italic italic italic italic italic italic">© 2024 Instituto Alegria de Viver • Matrícula, Frequência e Certificação Local Storage v1.2.0</p><div className="flex gap-4"><div className="p-4 bg-slate-50 rounded-2xl hover:text-orange-500 transition-all cursor-pointer shadow-sm hover:scale-110 shadow-slate-100 shadow-sm italic italic italic italic italic italic italic"><Instagram size={24}/></div><div className="p-4 bg-slate-50 rounded-2xl hover:text-blue-600 transition-all cursor-pointer shadow-sm hover:scale-110 shadow-slate-100 shadow-sm italic italic italic italic italic italic italic"><Facebook size={24}/></div></div></div></footer>
    </div>
  );
};

export default App;