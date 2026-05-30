import React, { useState } from 'react';

// --- ESTRUTURA DOS DADOS ---
interface Conversa {
  id: number;
  nome: string;
  avatar: string;
  subtexto: string;
  horario: string;
  tipo: 'cliente' | 'prestador' | 'parceiro';
  status: 'Pendente' | 'Aprovado';
  whatsOculto: string;
}

interface ProdutoVitrine {
  id: number;
  nome: string;
  preco: string;
  loja: string;
  link: string;
}

export default function App() {
  const [chatAtivoId, setChatAtivoId] = useState<number>(1);
  const [filtroAba, setFiltroAba] = useState<'tudo' | 'clientes' | 'prestadores'>('tudo');
  const [pesquisaLupa, setPesquisaLupa] = useState('');
  const [indexSlide, setIndexSlide] = useState(0);

  const produtos: ProdutoVitrine[] = [
    { id: 1, nome: 'Marmita Comercial do Dia', preco: 'R$ 22,00', loja: 'Restaurante da Ana', link: '#' },
    { id: 2, nome: 'Tinta Suvinil Branca 18L', preco: 'R$ 349,90', loja: 'Depósito Central', link: '#' },
    { id: 3, nome: 'Furadeira Bosch Impacto', preco: 'R$ 289,00', loja: 'Ferragens Bairro', link: '#' }
  ];

  const [conversas, setConversas] = useState<Conversa[]>([
    { id: 1, nome: 'Carlos Albuquerque', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80', subtexto: 'Carlos: Consegue começar na segunda-feira?', horario: '15:35', tipo: 'cliente', status: 'Aprovado', whatsOculto: '(11) 98888-7777' },
    { id: 2, nome: 'João Silva (Pintor)', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', subtexto: 'João: Já olhei o material no slide da loja.', horario: '14:20', tipo: 'prestador', status: 'Aprovado', whatsOculto: '(11) 91111-1111' },
    { id: 3, nome: 'Mariana Costa', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', subtexto: 'Solicitação de Cadastro: Manutenção Elétrica', horario: '11:05', tipo: 'cliente', status: 'Pendente', whatsOculto: '(11) 97777-6666' }
  ]);

  const [mensagensChat, setMensagensChat] = useState<{ [key: number]: string[] }>({
    1: ['Carlos: Olá João, tudo bem? Consegue olhar minha sala?', 'João: Opa! Consigo sim. Fica R$ 500 a mão de obra.', 'Carlos: Consegue começar na segunda-feira?'],
    2: ['João: Admin, preciso daquele cupom para a tinta do slide.', 'Admin: Liberado! Só clicar no link do carrossel.'],
    3: []
  });

  const [inputMsg, setInputMsg] = useState('');

  const aprovarMembro = (id: number) => {
    setConversas(conversas.map(c => c.id === id ? { ...c, status: 'Aprovado', subtexto: 'Cadastro aprovado pelo Administrador.' } : c));
  };

  const enviarMensagem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setMensagensChat({ ...mensagensChat, [chatAtivoId]: [...(mensagensChat[chatAtivoId] || []), `Admin: ${inputMsg}`] });
    setInputMsg('');
  };

  const listaFiltrada = conversas.filter(c => {
    const bateBusca = c.nome.toLowerCase().includes(pesquisaLupa.toLowerCase()) || c.subtexto.toLowerCase().includes(pesquisaLupa.toLowerCase());
    if (filtroAba === 'clientes') return bateBusca && c.tipo === 'cliente';
    if (filtroAba === 'prestadores') return bateBusca && c.tipo === 'prestador';
    return bateBusca;
  });

  const chatSelecionado = conversas.find(c => c.id === chatAtivoId);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', backgroundColor: '#eae6df', margin: 0, overflow: 'hidden', fontFamily: 'Segoe UI, sans-serif' }}>
      
      {/* COLUNA ESQUERDA: LISTA */}
      <div style={{ width: '400px', backgroundColor: '#fff', borderRight: '1px solid #e9edef', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: '60px', backgroundColor: '#f0f2f5', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
          <b>Grupo do Bairro - Admin</b>
        </div>
        <div style={{ padding: '10px' }}>
             <input style={{ width: '100%', padding: '8px' }} placeholder="Pesquisar..." value={pesquisaLupa} onChange={e => setPesquisaLupa(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '5px', padding: '10px' }}>
          <button onClick={() => setFiltroAba('tudo')}>Tudo</button>
          <button onClick={() => setFiltroAba('clientes')}>Clientes</button>
          <button onClick={() => setFiltroAba('prestadores')}>Prestadores</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {listaFiltrada.map(c => (
            <div key={c.id} onClick={() => setChatAtivoId(c.id)} style={{ padding: '15px', borderBottom: '1px solid #eee', cursor: 'pointer', backgroundColor: chatAtivoId === c.id ? '#f0f2f5' : '' }}>
              <b>{c.nome}</b> {c.status === 'Pendente' && '⚠️'}
              <p style={{ fontSize: '12px', margin: '5px 0 0' }}>{c.subtexto}</p>
            </div>
          ))}
        </div>
      </div>

      {/* COLUNA DIREITA: CONVERSA E VITRINE */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
         <div style={{ padding: '20px', background: '#fff', borderBottom: '1px solid #ccc' }}>
             <h3>Vitrine: {produtos[indexSlide].nome}</h3>
             <p>{produtos[indexSlide].preco} - {produtos[indexSlide].loja}</p>
             <button onClick={() => setIndexSlide((indexSlide + 1) % produtos.length)}>Próximo</button>
         </div>
         <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
             {chatSelecionado?.status === 'Pendente' && (
                 <div style={{ background: '#fff3cd', padding: '15px', marginBottom: '10px' }}>
                     Solicitação Pendente para {chatSelecionado.nome}. <button onClick={() => aprovarMembro(chatSelecionado.id)}>Aprovar</button>
                 </div>
             )}
             {(mensagensChat[chatAtivoId] || []).map((m, i) => <p key={i}>{m}</p>)}
         </div>
         <form onSubmit={enviarMensagem} style={{ padding: '20px' }}>
            <input value={inputMsg} onChange={e => setInputMsg(e.target.value)} style={{ width: '80%' }} />
            <button>Enviar</button>
         </form>
      </div>
    </div>
  );
}
