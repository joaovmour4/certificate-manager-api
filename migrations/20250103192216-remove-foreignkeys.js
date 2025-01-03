'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Remover as chaves estrangeiras
    for(let i=1; i<29; i+=1){
      await queryInterface.removeConstraint('empresaatividade', `empresaatividade_ibfk_${i}`);
    }
  },

  async down(queryInterface, Sequelize) {
    // Recriar as chaves estrangeiras, se necessário
    
  },
};
