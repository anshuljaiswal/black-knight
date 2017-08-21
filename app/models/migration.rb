class Migration < ApplicationRecord
  belongs_to :deploy_environment

  belongs_to :scheduled_by, class_name: "User"
  belongs_to :cancelled_by, class_name: "User"

  has_one :publisher, through: :deploy_environment

  scope :latest, -> { order("id desc").limit(5) }

  def execute_command
    "docker-migration.sh"
  end

  def execute_arguments
    JSON.parse(migration_command)
  end

  def buildable?
    true
  end

  def new_deploy_tag
    "#{deploy_environment.publisher.username}-#{deploy_environment.name}-mig-" + DateTime.now.strftime("%Y%m%d%H%M%S")
  end
end
