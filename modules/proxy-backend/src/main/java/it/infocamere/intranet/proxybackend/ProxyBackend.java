package it.infocamere.intranet.proxybackend;

import java.io.IOException;
import java.util.Collections;
import java.util.Set;

import javax.ws.rs.*;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.MediaType;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
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

/**
 * Servizio rest per chiamare da moduli frontend (react) i servizi di back-end. Gli endpoint sono
 * invocabili solo se l'utente ? loggato nel portale liferay, fornendo il token autorizzativo come
 * query parameter. Esempio endpoint:
 * http://intranetsv.intra.infocamere.it/o/proxy-backend/call?p_auth=TOKEN_UTENTE_LOGGATO
 * @author yyi4644
 */
@Component(
		property = {
				JaxrsWhiteboardConstants.JAX_RS_APPLICATION_BASE + "=/proxy-backend",
				JaxrsWhiteboardConstants.JAX_RS_NAME + "=Proxy.Backend",
		},
		service = Application.class
)
public class ProxyBackend extends Application {

	public Set<Object> getSingletons() {
		return Collections.<Object>singleton(this);
	}

	private static final Log _logger = LogFactoryUtil.getLog(ProxyBackend.class);

	private static final String VERBO_GET = "GET";
	private static final String VERBO_POST = "POST";

	@POST
	@Path("/call")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String call(DettaglioServizio dto) {
		_logger.debug("POST");
		_logger.debug("Body:");
		String body = dto.getBody();
		_logger.debug(body);
		_logger.debug("Verbo:");
		String verbo = dto.getVerbo().toUpperCase();
		_logger.debug(verbo);
		_logger.debug("Servizio:");
		String uri = dto.getUri();
		_logger.debug(uri);

		String response = "";
		if (VERBO_GET.equals(verbo)) {
			response = doCallGet(uri);
		} else if (VERBO_POST.equals(verbo)) {
			response = doCallPost(uri, body);
		} else {
			_logger.error("Verbo [" + verbo + "] non supportato");
		}

		_logger.debug("RISPOSTA:");
		_logger.debug(response);
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
				_logger.error("Status risposta: " + statusCode);
			}
		} catch (JsonMappingException | JsonParseException e) {
			_logger.error("Exception while parsing PaymentRequest", e);
		} catch (IOException ioe) {
			_logger.error("Exception while processing response from server", ioe);
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
				_logger.error("Status risposta: " + statusCode);
			}
		} catch (JsonMappingException | JsonParseException e) {
			_logger.error("Exception while parsing PaymentRequest", e);
		} catch (IOException ioe) {
			_logger.error("Exception while processing response from server", ioe);
		}
		return "{}";
	}

}