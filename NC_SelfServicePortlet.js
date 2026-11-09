/**
 * @NApiVersion 2.0
 * @NScriptType Portlet
 * SB1
 */
define(['N/log', 'N/search'], function (log, search) {
    var RECORD_TYPE = 'customrecord_nc_self_serv_req';

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function createLink(url, label, cssClass) {
        if (!url) {
            return '';
        }

        return '<a class="' + cssClass +
            '" href="' + escapeHtml(url) +
            '" target="_blank" rel="noopener">' +
            escapeHtml(label) +
            '</a>';
    }

    function render(params) {
        var portlet = params.portlet;
        portlet.title = 'Self-Service Requests';

        try {
            var requestSearch = search.create({
                type: RECORD_TYPE,
                filters: [
                    ['isinactive', search.Operator.IS, 'F']
                ],
                columns: [
                    search.createColumn({
                        name: 'name',
                        sort: search.Sort.ASC
                    }),
                    search.createColumn({
                        name: 'custrecord_nc_req_type'
                    }),
                    search.createColumn({
                        name: 'custrecord_nc_click_req_selfserv'
                    }),
                    search.createColumn({
                        name: 'custrecord_nc_template_'
                    }),
                    search.createColumn({
                        name: 'custrecord_nc_instructions_'
                    })
                ]
            });

            var results = requestSearch.run().getRange({
                start: 0,
                end: 1000
            });

            var cards = [];

            for (var i = 0; i < results.length; i += 1) {
                var result = results[i];

                var requestType =
                    result.getText({
                        name: 'custrecord_nc_req_type'
                    }) ||
                    result.getValue({
                        name: 'custrecord_nc_req_type'
                    }) ||
                    '';

                var title =
                    result.getValue({
                        name: 'name'
                    }) ||
                    requestType ||
                    'Request';

                var createRequestUrl = result.getValue({
                    name: 'custrecord_nc_click_req_selfserv'
                });

                var documentationUrl = result.getValue({
                    name: 'custrecord_nc_template_'
                });

                // This is Rich Text maintained in NetSuite.
                var instructions = result.getValue({
                    name: 'custrecord_nc_instructions_'
                });

                cards.push(
                    '<section class="nc-request-card">' +
                        '<h3>' + escapeHtml(title) + '</h3>' +
                        (requestType
                            ? '<p class="nc-request-type">' +
                                escapeHtml(requestType) +
                              '</p>'
                            : '') +
                        '<div class="nc-request-actions">' +
                            createLink(
                                createRequestUrl,
                                'Create Request',
                                'nc-primary-action'
                            ) +
                            createLink(
                                documentationUrl,
                                'Download Documentation',
                                'nc-secondary-action'
                            ) +
                        '</div>' +
                        (instructions
                            ? '<div class="nc-request-instructions">' +
                                instructions +
                              '</div>'
                            : '') +
                    '</section>'
                );
            }

            portlet.html =
                '<style>' +
                    '.nc-request-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(245px,1fr));gap:12px;}' +
                    '.nc-request-card{box-sizing:border-box;padding:16px;border:1px solid #d6dbe3;border-radius:6px;background:#fff;}' +
                    '.nc-request-card h3{margin:0 0 5px;color:#24364b;font-size:16px;}' +
                    '.nc-request-type{margin:0 0 14px;color:#5b6875;font-size:13px;}' +
                    '.nc-request-actions{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 14px;}' +
                    '.nc-request-actions a{padding:7px 10px;border-radius:4px;text-decoration:none;font-size:13px;}' +
                    '.nc-primary-action{background:#2373b9;color:#fff !important;}' +
                    '.nc-secondary-action{border:1px solid #2373b9;color:#17619e;}' +
                    '.nc-request-instructions{padding-top:12px;border-top:1px solid #e5e8ec;font-size:13px;line-height:1.45;}' +
                    '.nc-empty-message{color:#5b6875;}' +
                '</style>' +
                (cards.length
                    ? '<div class="nc-request-grid">' +
                        cards.join('') +
                      '</div>'
                    : '<p class="nc-empty-message">No active self-service request records are available.</p>');
        } catch (error) {
            log.error({
                title: 'Self-Service Requests portlet failed',
                details: error
            });

            portlet.html =
                '<p class="nc-empty-message">' +
                    'Unable to load self-service requests: ' +
                    escapeHtml(error.name || error.message || error) +
                '</p>';
        }
    }

    return {
        render: render
    };
});