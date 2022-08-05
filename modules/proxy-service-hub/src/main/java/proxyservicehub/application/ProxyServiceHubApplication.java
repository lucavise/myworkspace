package proxyservicehub.application;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
// import com.liferay.portal.kernel.log.Log;
// import com.liferay.portal.kernel.log.LogFactoryUtil;
import org.apache.http.HttpStatus;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.jaxrs.whiteboard.JaxrsWhiteboardConstants;

import javax.ws.rs.*;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.MediaType;
import java.io.IOException;
import java.util.Collections;
import java.util.Set;

/**
 * @author lvisentin@siav.net
 */
@Component(
	property = {
		JaxrsWhiteboardConstants.JAX_RS_APPLICATION_BASE + "=/proxy-service-hub",
		JaxrsWhiteboardConstants.JAX_RS_NAME + "=Proxy.ServiceHub"
	},
	service = Application.class
)
public class ProxyServiceHubApplication extends Application {

	public Set<Object> getSingletons() {
		return Collections.<Object>singleton(this);
	}

	// private static final Log _logger = LogFactoryUtil.getLog(ProxyServiceHubApplication.class);
	private static final String VERBO_GET = "GET";
	private static final String VERBO_POST = "POST";
	private static final String VERBO_LIFERAY = "LFRY";

	@GET
	@Produces("text/plain")
	public String working() {
		return "It works!";
	}

	@GET
	@Path("/morning")
	@Produces("text/plain")
	public String hello() {
		return "Good morning!";
	}

	@GET
	@Path("/morning/{name}")
	@Produces("text/plain")
	public String morning(
		@PathParam("name") String name,
		@QueryParam("drink") String drink) {

		String greeting = "Good Morning " + name;

		if (drink != null) {
			greeting += ". Would you like some " + drink + "?";
		}

		return greeting;
	}

	@GET
	@Path("/fetchUserByUserID/{userid}")
	@Produces("text/plain")
	public String fetchUserByUserID(
			@PathParam("userid") String userid) {

		String aa = "";

		return aa;
	}

	@POST
	@Path("/call")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String call(DettaglioServizio dto) {
		// commento 81
		// commento 82
		String body = dto.getBody();
		// _commento 84
		// commento 85
		String verbo = dto.getVerbo().toUpperCase();
		// commento 87
		// commento 88
		String uri = dto.getUri();
		// _logger.debug(uri);

		String response = "";
		if (VERBO_GET.equals(verbo)) {
			response = doCallGet(uri);
		} else if (VERBO_POST.equals(verbo)) {
			response = doCallPost(uri, body);
		} else if (VERBO_LIFERAY.equals(verbo)) {
			response = doCallPost(uri, body);
		} else {
			// _logger.error("Verbo [" + verbo + "] non supportato");
		}

		// _logger.debug("RISPOSTA:");
		// _logger.debug(response);
		return response;
	}

	private static String doCallPost(String uri, String body) {
		HttpClientBuilder httpClientBuilder = HttpClientBuilder.create();

		try (CloseableHttpClient httpClient = httpClientBuilder.build()) {

			StringEntity requestEntity = new StringEntity(body, ContentType.APPLICATION_JSON);

			HttpPost postMethod = new HttpPost(uri);
			postMethod.setEntity(requestEntity);

			CloseableHttpResponse rawResponse = httpClient.execute(postMethod);

			int statusCode = rawResponse.getStatusLine().getStatusCode();
			if (statusCode == HttpStatus.SC_OK) {
				return EntityUtils.toString(rawResponse.getEntity());
			} else {
				// _logger.error("Status risposta: " + statusCode);
			}
		} catch (JsonMappingException | JsonParseException e) {
			// _logger.error("Exception while parsing PaymentRequest", e);
		} catch (IOException ioe) {
			// _logger.error("Exception while processing response from server", ioe);
		}
		return "{}";
	}

	private static String doCallGet(String uri) {
		HttpClientBuilder httpClientBuilder = HttpClientBuilder.create();
		try (CloseableHttpClient httpClient = httpClientBuilder.build()) {

			HttpGet getMethod = new HttpGet(uri);

			CloseableHttpResponse rawResponse = httpClient.execute(getMethod);
			int statusCode = rawResponse.getStatusLine().getStatusCode();
			if (statusCode == HttpStatus.SC_OK) {
				return EntityUtils.toString(rawResponse.getEntity());
			} else {
				// _logger.error("Status risposta: " + statusCode);
			}
		} catch (JsonMappingException | JsonParseException e) {
			// _logger.error("Exception while parsing PaymentRequest", e);
		} catch (IOException ioe) {
			// _logger.error("Exception while processing response from server", ioe);
		}
		return "{}";
	}

}