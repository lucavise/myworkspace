#### Note 
Il modulo è stato sviluppato per poter interrogare i servizi di backend (intr-e) anche da browser, previa
autenticazione nella intranet: è necessario infatti fornire authToken Liferay presente in sesisone.

Espone un singolo endpoint (in POST), ove il body deve contenere un json così formato:
```json
{
  "verbo" : "POST", /* oppure GET */
  "body": "{}", /* body (eventuale) della richiesta originale */ 
  "uri": "https://icapissv.intra.infocamere.it/ic/si/intr/intr/rest/inta/intra/intaservice/icapp/insertNotification/?client_id=e55b8ea6-d713-47bf-874f-8ca2fe620814"
}
```