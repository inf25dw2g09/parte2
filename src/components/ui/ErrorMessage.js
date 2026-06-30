export default function ErrorMessage({ message = 'Ocorreu um erro.' }) {
  return <div className="error-msg">{message}</div>;
}