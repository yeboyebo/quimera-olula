import './SinDatos.css';


export const SinDatos = () => {
 
  return (
    <div className="SinDatos">
      <svg className="documentIcon" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArticleIcon"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-5 14H7v-2h7zm3-4H7v-2h10zm0-4H7V7h10z"></path></svg>
      <span>No hay datos</span>
    </div>
  );
};
