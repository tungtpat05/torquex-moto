package com.company.torquexmoto.dto.product.request;

public final class MediaValidation {
    public static final String MEDIA_PATH_REGEX = "^(https?://.+|/images/.+)$";
    public static final String MEDIA_PATH_MESSAGE = "Media path must start with http://, https://, or /images/";

    private MediaValidation() {
    }
}
