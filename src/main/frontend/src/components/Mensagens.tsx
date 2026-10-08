interface Props { erro: string; sucesso: string }

export default function Mensagens({ erro, sucesso }: Props) {
  return <div className="messages">
    {sucesso && <p className="message success" role="status">{sucesso}</p>}
    {erro && <p className="message error" role="alert">{erro}</p>}
  </div>;
}
