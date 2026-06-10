'use strict';

/**
 * A minimal, native-feeling fetch implementation for ScriptCraft
 * using Java 11's HttpClient.
 */

var HttpClient = java.net.http.HttpClient;
var HttpRequest = java.net.http.HttpRequest;
var HttpResponse = java.net.http.HttpResponse;
var URI = java.net.URI;
var Duration = java.time.Duration;

var client = HttpClient.newBuilder()
    .connectTimeout(Duration.ofSeconds(10))
    .build();

/**
 * Implementation of the global fetch() function.
 * 
 * @param {string} url The URL to fetch.
 * @param {object} [options] Fetch options (method, headers, body).
 * @returns {Promise} A promise that resolves to a Response object.
 */
function fetch(url, options) {
    options = options || {};
    var method = options.method || 'GET';
    var headers = options.headers || {};
    var body = options.body;

    var requestBuilder = HttpRequest.newBuilder()
        .uri(URI.create(url))
        .timeout(Duration.ofSeconds(30));

    // Set Method and Body
    if (method === 'GET') {
        requestBuilder.GET();
    } else if (method === 'POST') {
        requestBuilder.POST(HttpRequest.BodyPublishers.ofString(body || ''));
    } else if (method === 'PUT') {
        requestBuilder.PUT(HttpRequest.BodyPublishers.ofString(body || ''));
    } else if (method === 'DELETE') {
        requestBuilder.DELETE();
    } else {
        requestBuilder.method(method, HttpRequest.BodyPublishers.ofString(body || ''));
    }

    // Set Headers
    for (var header in headers) {
        requestBuilder.header(header, headers[header]);
    }

    var request = requestBuilder.build();

    // In ScriptCraft/GraalVM, we can use CompletableFuture and wrap it in a JS Promise
    return new Promise(function(resolve, reject) {
        client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
            .thenAccept(function(response) {
                resolve({
                    ok: response.statusCode() >= 200 && response.statusCode() < 300,
                    status: response.statusCode(),
                    statusText: response.statusCode().toString(),
                    headers: {
                        get: function(name) {
                            return response.headers().firstValue(name).orElse(null);
                        }
                    },
                    text: function() {
                        return Promise.resolve(response.body());
                    },
                    json: function() {
                        try {
                            return Promise.resolve(JSON.parse(response.body()));
                        } catch (e) {
                            return Promise.reject(e);
                        }
                    }
                });
            })
            .exceptionally(function(ex) {
                reject(ex);
                return null;
            });
    });
}

module.exports = fetch;
