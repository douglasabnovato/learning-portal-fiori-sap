/* Teste OPA5 do fluxo principal (#19): abre o catálogo, busca uma trilha e abre o detalhe */
sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/EnterText",
    "sap/ui/test/actions/Press",
    "sap/ui/test/matchers/AggregationLengthEquals",
    "sap/ui/test/matchers/PropertyStrictEquals"
], function (opaTest, Opa5, EnterText, Press, AggregationLengthEquals, PropertyStrictEquals) {
    "use strict";

    var TRILHA = "AI Assistant - Joule & GenAI";

    Opa5.extendConfig({
        viewNamespace: "com.douglas.learningportal.view.",
        autoWait: true,
        timeout: 60
    });

    QUnit.module("Catálogo");

    opaTest("abre o catálogo com as 11 trilhas", function (Given, When, Then) {
        Given.iStartMyUIComponent({
            componentConfig: { name: "com.douglas.learningportal", async: true },
            hash: ""
        });
        Then.waitFor({
            viewName: "Master",
            id: "trilhasGrid",
            matchers: new AggregationLengthEquals({ name: "items", length: 11 }),
            success: function () {
                Opa5.assert.ok(true, "a grade mostra 11 trilhas");
            },
            errorMessage: "A grade não mostrou as 11 trilhas"
        });
    });

    opaTest("a busca por Joule deixa uma trilha", function (Given, When, Then) {
        When.waitFor({
            viewName: "Master",
            id: "searchField",
            actions: new EnterText({ text: "Joule" }),
            errorMessage: "Campo de busca não encontrado"
        });
        Then.waitFor({
            viewName: "Master",
            id: "trilhasGrid",
            matchers: new AggregationLengthEquals({ name: "items", length: 1 }),
            success: function () {
                Opa5.assert.ok(true, "sobra 1 trilha");
            },
            errorMessage: "A busca não filtrou para 1 trilha"
        });
    });

    opaTest("o botão do card abre o detalhe da trilha", function (Given, When, Then) {
        When.waitFor({
            viewName: "Master",
            controlType: "sap.m.Button",
            matchers: new PropertyStrictEquals({ name: "tooltip", value: TRILHA }),
            actions: new Press(),
            errorMessage: "Botão do card não encontrado"
        });
        Then.waitFor({
            viewName: "Detail",
            controlType: "sap.m.ObjectHeader",
            matchers: new PropertyStrictEquals({ name: "title", value: TRILHA }),
            success: function () {
                Opa5.assert.ok(/^#\/trilha\/4$/.test(window.location.hash), "o detalhe mostra a trilha, e a URL termina em #/trilha/4");
            },
            errorMessage: "O detalhe não mostrou a trilha"
        });
        Then.iTeardownMyUIComponent();
    });
});
/* Fim de CatalogoJourney.js */
