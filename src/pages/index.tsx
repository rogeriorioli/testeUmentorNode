// pages/index.tsx

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

interface Employer {
  id: string;
  email: string;
  nome: string;
  situacao: string;
  data_admissao: string;
  created_at: string;
  updated_at: string;
}

export default function Home() {
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    nome: '',
    situacao: '',
    data_admissao: '',
  });

  const fetchEmployers = async () => {
    try {
      const response = await fetch('/api/employers');
      if (!response.ok) {
        throw new Error('A resposta da rede não estava ok');
      }
      const data = await response.json();
      setEmployers(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro desconhecido.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/employers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Falha ao criar empregador');
      }

      const newEmployer = await response.json();
      setEmployers((prev) => [...prev, newEmployer]);
      setFormData({ email: '', nome: '', situacao: '', data_admissao: '' });
      Swal.fire({
        title: 'Sucesso!',
        text: 'Empregado adicionado com sucesso.',
        icon: 'success',
        confirmButtonText: 'Fechar',
        confirmButtonColor: 'green'
        });
    } catch (err) {
      if (err instanceof Error) {

        setError(err.message);
        Swal.fire({
          title: 'Erro!',
          text: err.message,
          icon: 'error',
          confirmButtonText: 'Fechar',
          confirmButtonColor: 'red'
          });
      } else {
        setError('Ocorreu um erro desconhecido.');
      }
    }
  };

  return (
    <main>
          <div className="container mx-auto">

      <h1 className="text-2xl font-bold mb-4">Tabela de Empregados</h1>
      
 
      {loading && <p>Carregando...</p>}
      {!loading && !error && employers.length === 0 && (
        <p>Nenhum empregador encontrado.</p>
      )}
      {employers.length > 0 && (
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">ID</th>
                    <th className="py-3 px-6 text-left">Nome</th>
                    <th className="py-3 px-6 text-left">Email</th>
                    <th className="py-3 px-6 text-left">Situação</th>
                    <th className="py-3 px-6 text-left">Data de Admissão</th>
                    <th className="py-3 px-6 text-left">Data e Hora (Cadastro)</th>
                    <th className="py-3 px-6 text-left">Data e Hora (Atualização)</th>

                </tr>
          </thead>
          <tbody>
            {employers.map((employer) => (
            <tr className="bg-white border-b hover:bg-gray-100">
              <td className="px-4 py-2">{employer.id}</td>
              <td className="px-4 py-2">{employer.nome}</td>
              <td className="px-4 py-2">{employer.email}</td>
              <td className="px-4 py-2">{employer.situacao}</td>
              <td className="px-4 py-2">{employer.data_admissao}</td>
              <td className="px-4 py-2">{new Date(employer.created_at).toLocaleString()}</td>
              <td className="px-4 py-2">{new Date(employer.updated_at).toLocaleString()}</td>
        </tr>
            ))}
          </tbody>
        </table>
      )}
        <div className="mt-16">

        <h1 className="text-2xl font-bold mb-4">Criar Novo Empregado</h1>
           <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={formData.nome}
            onChange={handleInputChange}
            required
            className="border border-gray-300 p-2 rounded placeholder:text-black"
            />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="border border-gray-300 p-2 rounded placeholder:text-black"
            />
          <input
            type="text"
            name="situacao"
            placeholder="Situação"
            value={formData.situacao}
            onChange={handleInputChange}
            required
            className="border border-gray-300 p-2 rounded placeholder:text-black"
            />
          <input
            type="date"
            name="data_admissao"
            value={formData.data_admissao}
            onChange={handleInputChange}
            required
            className="border border-gray-300 p-2 rounded placeholder:text-black"
            />
        </div>
        <button
          type="submit"
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
          >
          Adicionar Empregado
        </button>
      </form>
      </div>
      </div>
    </main>
  );
}
