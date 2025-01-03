'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Remover as chaves estrangeiras
    for(let i=4; i<19; i+=1){
      await queryInterface.removeConstraint('empresa', `empresa_ibfk_${i}`);
    }
  },

  async down(queryInterface, Sequelize) {
    // Recriar as chaves estrangeiras, se necessário
    
  },
};
