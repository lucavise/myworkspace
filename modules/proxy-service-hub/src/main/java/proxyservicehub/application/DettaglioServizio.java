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

    public String getUri() {
        return uri;
    }

    public void setUri(String uri) {
        this.uri = uri;
    }
}
