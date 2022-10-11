package it.siav.italianresourcebundle;

import com.liferay.portal.kernel.language.UTF8Control;
import org.osgi.service.component.annotations.Component;
import java.util.Enumeration;
import java.util.ResourceBundle;

import org.osgi.service.component.annotations.Component;

/**
 * @author lvisentin@siav.net
 */
@Component(
	property = { "language.id=it_IT" },
	service = ResourceBundle.class
)
public class ItalianResourceBundle extends ResourceBundle {

	@Override
	protected Object handleGetObject(String key) {
		return _resourceBundle.getObject(key);
	}

	@Override
	public Enumeration<String> getKeys() {
		return _resourceBundle.getKeys();
	}

	private final ResourceBundle _resourceBundle = ResourceBundle.getBundle(
			"content.Language_it", UTF8Control.INSTANCE);
}