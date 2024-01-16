
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import './styles.css';

import api from './services/api';

function App() {
  const [input, setInput] = useState('');
  const [cepData, setCepData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSearch() {
    if (input === '') {
      setError('Preencha um CEP válido!');
      return;
    }

    // Verifica se o CEP digitado possui exatamente 8 dígitos numéricos
    const cepPattern = /^[0-9]{8}$/;
    if (!cepPattern.test(input)) {
      setError('Digite um CEP válido (com 8 dígitos numéricos)!');
      return;
    }

    try {
      // Limpa mensagens de erro e dados antigos ao iniciar uma nova busca
      setError(null);
      setCepData(null);
      setIsLoading(true);

      const script = document.createElement('script');
      const callbackName = 'handleCepResponse';

      window[callbackName] = function (data) {
        // Verifica se o serviço retornou um erro
        if (data && data.erro) {
          setError('CEP não encontrado. Verifique e tente novamente.');
          setInput("");
        } else {
          // Caso não haja erro, atualiza os dados do CEP
          setCepData(data);
          setInput("");
        }

        document.body.removeChild(script);
        delete window[callbackName];
        setIsLoading(false);
      };

      script.src = `https://viacep.com.br/ws/${input}/json/?callback=${callbackName}`;
      document.body.appendChild(script);
    } catch (error) {
      setError('Ops, ocorreu um erro ao buscar o CEP. Tente novamente mais tarde.');
      setIsLoading(false);
    }
  }

  function handleKeyPress(event) {
    // Permite a busca quando a tecla "Enter" for pressionada
    if (event.key === 'Enter') {
      handleSearch();
    }
  }

  return (
    <div className="container">
      <h1 className="title"> Buscador de CEP </h1>

      <div className="containerInput">
        <input
          type="text"
          placeholder="Digite um CEP..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />

        <button className="buttonSearch" onClick={handleSearch} disabled={isLoading}>
          <FiSearch size={25} color="#fff" />
        </button>
      </div>


      <main className={`main ${isLoading || error || !cepData?.cep ? 'mobile-hide' : ''}`}>
  {isLoading && <p>Carregando...</p>}
  {error && <p className="error">{error}</p>}
  {cepData?.cep && (
    <>
      <h2>CEP: {cepData.cep}</h2>
      <span> Rua: {cepData.logradouro}</span>
      {cepData.complemento && <span> Complemento: {cepData.complemento}</span>}
      <span> Bairro: {cepData.bairro}</span>
      <span> Cidade: {cepData.localidade} - {cepData.uf}</span>
    </>
  )}
</main>
    </div>
  );
}

export default App;

