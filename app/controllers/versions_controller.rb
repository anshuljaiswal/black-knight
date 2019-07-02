class VersionsController < ApplicationController
  before_action :authenticate_user!,:unconfirmed_mfa!

  before_action :load_current_environment_and_config

  def show
  	@config_version = @current_config_file.revision(params[:id].to_i)
    render json: @config_version
  end

  def index
    @config_versions =  @current_config_file.revisions
    render json: @config_versions
  end

  private
  def load_current_environment_and_config
    @current_deploy_environment = current_user.deploy_environments.find(params[:environment_id])
    @current_config_file = @current_deploy_environment.config_files.find(params[:config_file_id])
  end
end
