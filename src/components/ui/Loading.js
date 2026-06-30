export default function Loading({ message = 'A carregar…' }) {
  return (
    <div className="loading-msg">
      <div className="spinner" style={{ margin: '0 auto 0.75rem' }} />
      <p>{message}</p>
    </div>
  );
}