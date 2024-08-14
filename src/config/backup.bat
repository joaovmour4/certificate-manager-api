@echo off
chcp 65001

REM Navegar até o diretório onde as pastas serão criadas
cd "C://PUBLICA//AGENDA DE OBRIGAÇÕES FISCAIS//TI//certificate-manager//build//backup"

REM Definir a data atual no formato yyyyMMdd
for /f "delims=" %%i in ('powershell -NoProfile -Command "(Get-Date).ToString(\"yyyyMMdd\")"') do (
    set "folderName=%%i"
)

REM Criar uma nova pasta com a data atual, caso ainda não exista
IF NOT EXIST "%folderName%\" MKDIR "%folderName%"
cd "%folderName%"

REM Executar o dump do banco de dados
mysqldump -u su -pPassword db_name > db_name.sql

cd ..

REM Definir a data de 7 dias atrás no formato yyyyMMdd
for /f "delims=" %%i in ('powershell -NoProfile -Command "(Get-Date).AddDays(-7).ToString(\"yyyyMMdd\")"') do (
    set "sevendaysago=%%i"
)

echo Data limite: %sevendaysago%

REM Listar e excluir pastas mais antigas que 7 dias, baseando-se no nome da pasta
for /d %%i in (20*??*??) do (
    REM Obter o nome da pasta
    set "foldername=%%i"

    REM Comparar a data da pasta com a data limite
    if %%i LSS %sevendaysago% (
        echo Deletando pasta: %%i
        rmdir /s /q "%%i"
    ) else (
        echo Pasta não deletada: %%i
    )
)
