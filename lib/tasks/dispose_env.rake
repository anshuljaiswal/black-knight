namespace :dispose_env do
  desc "TODO"
  task dispose_env: :environment do
      DisposableEnvs = DeployEnvironment.where(disposable: true)
      DisposableEnvs.each do |dispose_env|
          ScaleContainerJob.perform_now(dispose_env.id,114,0)
          sleep(2)
      end
  end
end
