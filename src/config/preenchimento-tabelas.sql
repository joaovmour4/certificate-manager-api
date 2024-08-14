INSERT INTO Setor (setorName) VALUES ("Fiscal"), ("Contábil"), ("Pessoal"), ("Financeiro");
INSERT INTO Usuario (username, login, email, password, idSetor, cargo, createdAt, updatedAt) VALUES 
("Adriele", "adriele", "adriele@mg.com", "$2b$10$8..IwX47WYrexxSUyhd.F.mfWQUc3/7ATfdE51BVt1M1CfBihxPli", 1, "supervisor", "1000-01-01 00:00:00.000000", "1000-01-01 00:00:00.000000"),
("João Vitor", "joaovmoura", "joao@mg.com", "$2b$10$8..IwX47WYrexxSUyhd.F.mfWQUc3/7ATfdE51BVt1M1CfBihxPli", NULL, "admin", "1000-01-01 00:00:00.000000", "1000-01-01 00:00:00.000000"),
("Tayane", "tayane", "tayane@mg.com", "$2b$10$8..IwX47WYrexxSUyhd.F.mfWQUc3/7ATfdE51BVt1M1CfBihxPli", 1, "operador", "1000-01-01 00:00:00.000000", "1000-01-01 00:00:00.000000"),
("Thaynara", "thaynara", "thaynara@mg.com", "$2b$10$8..IwX47WYrexxSUyhd.F.mfWQUc3/7ATfdE51BVt1M1CfBihxPli", 4, "supervisor", "1000-01-01 00:00:00.000000", "1000-01-01 00:00:00.000000"),
("Leunam", "leunam", "leunam@mg.com", "$2b$10$8..IwX47WYrexxSUyhd.F.mfWQUc3/7ATfdE51BVt1M1CfBihxPli", 2, "supervisor", "1000-01-01 00:00:00.000000", "1000-01-01 00:00:00.000000");
INSERT INTO regime (regimeName) VALUES ("Simples"), ("Presumido"), ("Real");
INSERT INTO Obrigacao (obrigacaoName, obrigacaoShortName, idSetor, createdAt, updatedAt) VALUES 
("PGDAS", "pgdas", 1, "1000-01-01 00:00:00.000000", "1000-01-01 00:00:00.000000"), 
("ICMS NORMAL", "icms", 1, "1000-01-01 00:00:00.000000", "1000-01-01 00:00:00.000000"), 
("DIEF", "dief", 1, "1000-01-01 00:00:00.000000", "1000-01-01 00:00:00.000000"), 
("SPED FISCAL", "sped", 1, "1000-01-01 00:00:00.000000", "1000-01-01 00:00:00.000000"), 
("EFD REINF", "reinf", 1, "1000-01-01 00:00:00.000000", "1000-01-01 00:00:00.000000"), 
("ISSQN", "issqn", 1, "1000-01-01 00:00:00.000000", "1000-01-01 00:00:00.000000"), 
("DAS", "das", 1, "1000-01-01 00:00:00.000000", "1000-01-01 00:00:00.000000"), 
("DEFIS", "defis", 1, "1000-01-01 00:00:00.000000", "1000-01-01 00:00:00.000000"), 
("EFD PIS/COFINS", "pis/cofins", 1, "1000-01-01 00:00:00.000000", "1000-01-01 00:00:00.000000");
INSERT INTO excecao (excecaoName, createdAt, updatedAt) VALUES 
("ANUAL", "1000-01-01 00:00:00.000000", "1000-01-01 00:00:00.000000"), 
("SERVICO", "1000-01-01 00:00:00.000000", "1000-01-01 00:00:00.000000"), 
("SEM IE", "1000-01-01 00:00:00.000000", "1000-01-01 00:00:00.000000");
INSERT INTO obrigacaoexcecao (idObrigacao, idExcecao) VALUES 
(4, 3),
(5, 3),
(4, 2),
(5, 2),
(8, 1);
INSERT INTO RegimeObrigacao (RegimeIdRegime, ObrigacaoIdObrigacao) VALUES 
(1, 1), (3, 2), (2, 3), (2, 5), (2, 6), (3, 4), (3, 7), (3, 8), (3, 9);
INSERT INTO competencia (mes, ano) VALUES (7, 2024), (8, 2024);
INSERT INTO atividade (idObrigacao, idCompetencia) VALUES 
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (6, 1), (7, 1), (8, 1), (9, 1), 
(1, 2), (2, 2), (3, 2), (4, 2), (5, 2), (6, 2), (7, 2), (8, 2), (9, 2);
INSERT INTO Empresa (nameEmpresa, activeEmpresa, codigoQuestor, cnpjEmpresa, inscricaoEmpresa, situacaoIE, representante, createdAt, updatedAt, deletedAt, idRegime, situacaoFinanceiro) VALUES 
('MOURA E GAGLIARDI CONTABILIDADE E CONSULTORIA', '1', '4', '00.000.000/0000-03', '00001', 'SERVICO', '000.000.000-03', '2024-05-15 15:51:17', '2024-05-16 12:03:54', NULL, '2', '{"active":"true", "date":"1000-01-01 00:00:00.000000"}'), 
('BMC SERVICE EIRELI', '1', '3', '00.000.000/0000-02', '00002', 'HABILITADO', '000.000.000-03', '2024-05-15 15:51:17', '2024-05-16 12:03:54', NULL, '1', '{"active":"true", "date":"1000-01-01 00:00:00.000000"}'), 
('MOURA E GAGLIARDI CONTABILIDADE', '1', '2', '00.000.000/0000-01', NULL, 'INABILITADA', '000.000.000-02', '2024-05-15 15:51:17', '2024-05-16 12:03:54', NULL, '3', '{"active":"true", "date":"1000-01-01 00:00:00.000000"}');
INSERT INTO setorempresa (idEmpresa, idSetor) VALUES 
(1, 4), (1, 1), (2, 4), (2, 1), (2, 2), (2, 3), (3, 4), (3, 3);
INSERT INTO empresaatividade (EmpresaIdEmpresa, idObrigacao, AtividadeIdAtividade) VALUES 
(2, 1, 1), (2, 1, 10), (1, 3, 3), (1, 3, 12), (1, 5, 5), (1, 5, 14), (1, 6, 6), (1, 6, 15), 
(3, 2, 2), (3, 2, 11), (3, 4, 4), (3, 4, 13), (3, 7, 7), (3, 7, 16), (3, 8, 8), (3, 8, 17), 
(3, 9, 9), (3, 9, 18);
INSERT INTO usuarioempresa (idEmpresa, idUsuario) VALUES  
(1, 1), (1, 2), (2, 1), (3, 2);
