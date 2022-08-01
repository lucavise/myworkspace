package proxyservicehub.application;

public class DettaglioServizio {

    /**
     * GET o POST
     */
    private String verbo;
    /**
     * Body del servizio da richiamare
     */
    private String body;
    /**
     * Endpoint del servizio da richiamare
     */
    private String uri;

    /**
     * motodo che referenzia servizi liferay interni da noi sviluppati
     */
    private String methodLFRY;

    /**
     * getter del verbo
     * @return
     */
    public String getVerbo() {
        return verbo;
    }

    public void setVerbo(String verbo) {
        this.verbo = verbo;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    /**
     * getter dell'uri che vado a chiamare dal proxy
     * @return
     */
    public String getUri() {
        return uri;
    }

    /**
     * campo che gestisce il motodo
     * che referenzia servizi liferay interni da noi sviluppati
     */
    public String getMethodLFRY() { return methodLFRY; }

    public void setUri(String uri) {
        this.uri = uri;
    }
}
