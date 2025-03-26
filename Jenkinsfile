pipeline {
    agent any
    environment {
        NODE_ENV = 'production'
        PORT = '4000'
        PATH = "C:\\Program Files\\nodejs;${env.PATH}"
        SONARQUBE_URL = 'http://localhost:9000'   // Replace with your SonarQube server URL
        SONARQUBE_TOKEN = credentials('d814a8a3-bada-4f74-a879-1243b619f0b3') // Reference to the SonarQube token (ensure this is configured in Jenkins' credentials store)
        SONAR_SCANNER_HOME = 'C:\\sonar-scanner'
        HOMEPATH = 'C:\\Users\\mohit.k.singh'
        PM2_HOME = 'C:\\Users\\mohit.k.singh\\.pm2'
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Clone the repository from Git
                checkout([
                        $class: 'GitSCM',
                        branches: [[name: 'main']],
                        userRemoteConfigs: [[
                            url: 'https://github.com/skycast88/SkyCast.git',    
                            credentialsId: 'd438b28d-8ef3-4d75-b3ec-e5247bb025f3' // Replace with your Jenkins credentials ID
                        ]]
                    ])
            }
        }
	stage('Install Dependencies') {
            steps {
                // Install Node.js dependencies using npm
                script {
                    bat 'npm install'  // Windows batch command for npm install
                }
            }
        }
	stage('Build') {
            steps {
                bat 'npm run build'
            }
        }
	stage('SonarQube Analysis') {
            steps {
                script {
                    // Run SonarQube scanner for code analysis
                    withSonarQubeEnv('LocalSonarQube') {  // 'Local SonarQube' is the name of your configured SonarQube instance in Jenkins
                        bat """
                            %SONAR_SCANNER_HOME%\\bin\\sonar-scanner.bat ^
                            -Dsonar.projectKey=com.skycast ^
                            -Dsonar.projectName="Skycast" ^
                            -Dsonar.projectVersion=1.0 ^
                            -Dsonar.sources=.
                            -Dsonar.host.url=%SONARQUBE_URL% ^
                            -Dsonar.login=%SONARQUBE_TOKEN%
                        """
                    }
                }
            }
        }
	stage('Run Performance Test') {
            steps {
                script {
                    echo 'Running performance test...'
                    bat 'artillery run performance/performance-test.yml --output performance/report.json'  // Adjust path if needed
                }
            }
        }
	stage('Run Security Audit') {
            steps {
                script {
                    echo 'Running npm audit...'
                    bat 'npm audit --json > npm-audit-report.json'
                    echo 'Generating npm audit report...'
                    bat 'npm audit'
                }
            }
        }
	stage('Start Server') {
            steps {
                // Run the server on localhost:3000
                script {
                    bat '''@echo off
                    pm2 list | findstr /i "skycast" > nul
                    if %errorlevel% equ 0 (
                        echo "Application 'skycast' is running, restarting it..."
                        pm2 restart skycast
                    ) else (
                        echo "Application 'skycast' is not running, starting it..."
                        pm2 start app.js --name skycast
                        pm2 save
                    )
                    '''
                }
            }
        }
    }
            
    post {
        success {
            echo 'Deployment was successful!'
        }
        failure {
            echo 'Deployment failed!'
        }
    
	always {
            archiveArtifacts artifacts: 'npm-audit-report.json, report.html', allowEmptyArchive: true
            archiveArtifacts artifacts: 'performance/report.json', allowEmptyArchive: true
            script {
                // Capture the last 1000 lines of the console log output
                def consoleLog = currentBuild.rawBuild.getLog(1000).join("\n")
                
                // Print the captured log to console (optional)
                echo "Sending email with console log..."
                
                // Send email with the console log as an attachment
               emailext(
                subject: "Jenkins Build: ${currentBuild.result}",
                body: "Please find the build logs attached.",
                to: 'mohit.singh284@gmail.com, akshay.bhardwaj2@globallogic.com',
                attachLog: true, // Attach build logs
                attachmentsPattern: '**/build.log', // Modify this if you need a specific log file
                mimeType: 'text/plain' // Set MIME type for the logs
                )

            }
      }
  }
}
