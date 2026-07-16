/** Affiché quand aucune clé Ticketmaster n'est configurée dans .env */
export function ApiKeyNotice() {
  return (
    <div className="notice-card">
      <h3>Activer les événements en temps réel</h3>
      <p>
        Les événements proviennent de l'API Ticketmaster Discovery (gratuite). Pour les activer :
      </p>
      <ol>
        <li>
          Crée un compte sur <strong>developer.ticketmaster.com</strong> et copie ta « Consumer
          Key » (menu <em>My Apps</em>).
        </li>
        <li>
          À la racine du projet, copie <code>.env.example</code> en <code>.env</code> et colle ta
          clé.
        </li>
        <li>
          Redémarre le serveur (<code>npm run dev</code>).
        </li>
      </ol>
      <p className="notice-muted">
        Paris affiche déjà de vrais événements sans clé, grâce à l'open data de la Ville de Paris.
      </p>
    </div>
  )
}
