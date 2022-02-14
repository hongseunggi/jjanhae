package io.openvidu.server.test.unit;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;

import io.openvidu.server.utils.FormatChecker;

public class FormatCheckerTest {

	@Test
	void customSessionIdFormatTest() {

		List<String> invalidCustomSessionIds = Arrays.asList("", "session#", "session!", "session*", "'session",
				"\"session", "sess(ion", "sess_ion)", "session:session", ";session;", "session@session", "$",
				"&session", "ses=sion", "+", "session,", "/session", "session?", "session#", "session%", "[session]",
				"session.", "~", "session~", "~session", "session~1", "\\session");

		List<String> validCustomSessionIds = Arrays.asList("s", "1", "-", "_", "_-_", "session", "session1",
				"0session10", "-session", "session-", "-session-", "_session", "session_", "_session_", "_-session",
				"session-_", "123_session-1");

		FormatChecker formatChecker = new FormatChecker();
		for (String id : invalidCustomSessionIds)
			assertFalse(formatChecker.isValidCustomSessionId(id));
		for (String id : validCustomSessionIds)
			assertTrue(formatChecker.isValidCustomSessionId(id));
	}

	@Test
	void acceptableRecordingResolutionTest() {

		List<String> invalidResolutions = Arrays.asList("", "a", "123", "true", "AXB", "AxB", "12x", "x12", "0920x1080",
				"1080x0720", "720x2000", "99x720", "1920X1080");

		List<String> validResolutions = Arrays.asList("1920x1080", "1280x720", "100x1999");

		FormatChecker formatChecker = new FormatChecker();
		for (String resolution : invalidResolutions)
			assertFalse(formatChecker.isAcceptableRecordingResolution(resolution));
		for (String resolution : validResolutions)
			assertTrue(formatChecker.isAcceptableRecordingResolution(resolution));
	}

	@Test
	void acceptableRecordingFrameRateTest() {

		List<Integer> invalidFrameRates = Arrays.asList(-1, 0, 121, 9999);

		List<Integer> validFramerates = Arrays.asList(1, 2, 30, 60, 119, 120);

		FormatChecker formatChecker = new FormatChecker();
		for (int framerate : invalidFrameRates)
			assertFalse(formatChecker.isAcceptableRecordingFrameRate(framerate));
		for (int framerate : validFramerates)
			assertTrue(formatChecker.isAcceptableRecordingFrameRate(framerate));
	}

}