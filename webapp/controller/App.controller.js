sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment"
], function (Controller, MessageToast, Fragment) {
    "use strict";

    return Controller.extend("com.douglas.learningportal.controller.App", {
        onInit: function () {
            // Inicialização do controller
        },

        onTrilhaPress: function (oEvent) {
            // Obtém o item que foi clicado
            var oItem = oEvent.getSource();
            // Obtém o contexto de dados do item no modelo JSON
            var oContext = oItem.getBindingContext();
            var oTrilhaData = oContext.getObject();

            // Exibe um Feedback Fiori (MessageToast)
            MessageToast.show("Selecionado: " + oTrilhaData.Titulo);

            // Criação programática de um Dialog simples para exibir os detalhes
            if (!this._oDialog) {
                this._oDialog = new sap.m.Dialog({
                    title: "Detalhes da Trilha",
                    type: "Message",
                    content: [
                        new sap.m.Text({ text: "Descrição: " + oTrilhaData.Descricao }),
                        new sap.m.Text({ text: "Carga Horária: " + oTrilhaData.Horas + " horas" }),
                        new sap.m.Text({ text: "Módulos Totais: " + oTrilhaData.ModulosCount }),
                        new sap.m.Text({ text: "Status Atual: " + oTrilhaData.Status })
                    ],
                    beginButton: new sap.m.Button({
                        text: "Fechar",
                        press: function () {
                            this._oDialog.close();
                        }.bind(this)
                    })
                });
                this.getView().addDependent(this._oDialog);
            } else {
                // Atualiza o conteúdo dinamicamente se necessário
                this._oDialog.getContent()[0].setText("Descrição: " + oTrilhaData.Descricao);
                this._oDialog.getContent()[1].setText("Carga Horária: " + oTrilhaData.Horas + " horas");
                this._oDialog.getContent()[2].setText("Módulos Totais: " + oTrilhaData.ModulosCount);
                this._oDialog.getContent()[3].setText("Status Atual: " + oTrilhaData.Status);
            }

            this._oDialog.open();
        }
    });
});