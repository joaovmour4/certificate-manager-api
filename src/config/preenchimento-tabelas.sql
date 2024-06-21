INSERT INTO Setor (setorName) VALUES ("Fiscal"), ("Contábil"), ("Pessoal"), ("Financeiro");
INSERT INTO Usuario (username, login, email, password, idSetor, cargo, createdAt, updatedAt) VALUES 
("Adriele", "adriele", "adriele@mg.com", "$2b$10$4VxoMtEmsPbIu.35x0wmfeu.9RmPBoTxDcQmuFI0q/cFGdVNEUAfu", 1, "supervisor", "1000-01-01 00:00:00.000000", "1000-01-01 00:00:00.000000"),
("João Vitor", "joaovmoura", "joao@mg.com", "$2b$10$4VxoMtEmsPbIu.35x0wmfeu.9RmPBoTxDcQmuFI0q/cFGdVNEUAfu", 2, "admin", "1000-01-01 00:00:00.000000", "1000-01-01 00:00:00.000000"),
("Thaynara", "thaynara", "thaynara@mg.com", "$2b$10$4VxoMtEmsPbIu.35x0wmfeu.9RmPBoTxDcQmuFI0q/cFGdVNEUAfu", 4, "supervisor", "1000-01-01 00:00:00.000000", "1000-01-01 00:00:00.000000");
INSERT INTO regime (regimeName) VALUES ("Simples"), ("Presumido"), ("Real");
INSERT INTO Obrigacao (obrigacaoName, obrigacaoShortName) VALUES 
("PGDAS", "pgdas"), ("DIEF", "dief"), ("DAE", "dae"), ("SPED FISCAL", "sped"), ("EFD REINF", "reinf"), ("ISSQN", "issqn"), ("ISSQN1", "issqn1"), ("ICMS Normal", "icms"), ("ISSQN2", "issqn2");
INSERT INTO RegimeObrigacao (RegimeIdRegime, ObrigacaoIdObrigacao) VALUES 
(1, 1), (3, 2), (2, 3), (2, 5), (2, 6), (3, 4), (3, 7), (3, 8), (3, 9);
INSERT INTO competencia (mes, ano) VALUES (5, 2024), (6, 2024);
INSERT INTO atividade (idObrigacao, idCompetencia) VALUES 
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (6, 1), (7, 1), (8, 1), (9, 1), 
(1, 2), (2, 2), (3, 2), (4, 2), (5, 2), (6, 2), (7, 2), (8, 2), (9, 2);
INSERT INTO Empresa (nameEmpresa, activeEmpresa, codigoQuestor, cnpjEmpresa, inscricaoEmpresa, representante, createdAt, updatedAt, deletedAt, idRegime, situacaoFinanceiro) VALUES 
('MOURA E GAGLIARDI CONTABILIDADE E CONSULTORIA', '1', '4', '00.000.000/0000-03', '00001', '000.000.000-03', '2024-05-15 15:51:17', '2024-05-16 12:03:54', NULL, '2', '{"active":"true", "date":"1000-01-01 00:00:00.000000"}'), 
('BMC SERVICE EIRELI', '1', '3', '00.000.000/0000-02', '00002', '000.000.000-03', '2024-05-15 15:51:17', '2024-05-16 12:03:54', NULL, '1', '{"active":"true", "date":"1000-01-01 00:00:00.000000"}'), 
('MOURA E GAGLIARDI CONTABILIDADE', '1', '2', '00.000.000/0000-01', '00003', '000.000.000-02', '2024-05-15 15:51:17', '2024-05-16 12:03:54', NULL, '3', '{"active":"true", "date":"1000-01-01 00:00:00.000000"}');
INSERT INTO setorempresa (idEmpresa, idSetor) VALUES 
(1, 4), (1, 1), (2, 4), (2, 1), (2, 2), (2, 3), (3, 4), (3, 3);
INSERT INTO empresaatividade (EmpresaIdEmpresa, idObrigacao, AtividadeIdAtividade) VALUES 
(2, 1, 1), (2, 1, 10), (1, 3, 3), (1, 3, 12), (1, 5, 5), (1, 5, 14), (1, 6, 6), (1, 6, 15), 
(3, 2, 2), (3, 2, 11), (3, 4, 4), (3, 4, 13), (3, 7, 7), (3, 7, 16), (3, 8, 8), (3, 8, 17), 
(3, 9, 9), (3, 9, 18);
INSERT INTO usuarioempresa (idEmpresa, idUsuario) VALUES  
(1, 1), (1, 2), (2, 1), (3, 2);
